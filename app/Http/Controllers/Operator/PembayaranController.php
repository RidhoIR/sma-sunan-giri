<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use App\Models\User;
use App\Notifications\PembayaranKonfirmasiNotification;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pembayaran = Pembayaran::with(
            [
                'tagihan',
                'tagihan.siswa',
                'tagihan.details',
                'wali',
                'user',
                'waliBank',
                'bankSekolah'
            ]
        )->get();

        return Inertia::render('operator/pembayaran/index', [
            'pembayaran' => $pembayaran
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'tagihan_id' => 'required|exists:tagihans,id',
                'jumlah_dibayar' => 'required|numeric',
                'tanggal_pembayaran' => 'required|date',
            ]);

            $tagihan = Tagihan::findOrFail($validated['tagihan_id']);
            if ($validated['jumlah_dibayar'] >= $tagihan->details->sum('jumlah_biaya')) {
                $tagihan->status = 'lunas';
            } else {
                $tagihan->status = 'angsur';
            }

            $tagihan->save();

            $waliId = $tagihan->siswa->waliSiswas->first()?->wali_id;


            Pembayaran::create([
                'tagihan_id' => $validated['tagihan_id'],
                'user_id' => Auth::user()->id,
                // 'status_konfirmasi' => 'sudah',
                'tanggal_konfirmasi' => now(),
                'jumlah_dibayar' => $validated['jumlah_dibayar'],
                'metode_pembayaran' => 'manual',
                'tanggal_pembayaran' => $validated['tanggal_pembayaran'],
                'wali_id' => $waliId,
            ]);

            return redirect()->back()->with('success', 'Pembayaran berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function cetakInvoice($id)
    {
        $pembayaran = Pembayaran::with(['tagihan.siswa','user'])->findOrFail($id);

        $pdf = Pdf::loadView('invoice-pembayaran', compact('pembayaran'))
            ->setPaper('A5', 'portrait'); // ukuran A5 seperti kwitansi

        return $pdf->stream('kwitansi-' . $pembayaran->id . '.pdf');
    }

    public function detail(Pembayaran $pembayaran)
    {
        $notification = auth()->user()->notifications()->where('data->pembayaran_id', $pembayaran->id)->first();

        if ($notification) {
            $notification->markAsRead();
        }
        $pembayaran->load([
            'tagihan',
            'tagihan.siswa', // kalau di Tagihan ada relasi siswa
            'tagihan.details',
            'wali',
            'user',
            'waliBank',
            'bankSekolah',
        ]);

        return Inertia::render('operator/pembayaran/detail', [
            'pembayaran' => $pembayaran
        ]);
    }

    public function konfirmasi(Pembayaran $pembayaran)
    {
        try {
            $pembayaran->update([
                // 'status_konfirmasi' => 'sudah',
                'user_id' => Auth::user()->id,
                'tanggal_konfirmasi' => now(),
            ]);

            // Hitung total biaya tagihan
            $totalBiaya = $pembayaran->tagihan->details->sum('jumlah_biaya');

            // Hitung total seluruh pembayaran yang sudah dikonfirmasi untuk tagihan ini
            $totalDibayar = $pembayaran->tagihan->pembayarans()
                ->sum('jumlah_dibayar');

            // Tentukan status tagihan
            if ($totalDibayar < $totalBiaya) {
                $pembayaran->tagihan->status = 'angsur';
            } elseif ($totalDibayar >= $totalBiaya) {
                $pembayaran->tagihan->status = 'lunas';
            }

            // $pembayaran->tagihan->status = 'lunas';
            $pembayaran->tagihan->save();

            $waliId = $pembayaran->wali;

            $waliId->notify(new PembayaranKonfirmasiNotification($pembayaran));

            foreach ($pembayaran->tagihan->siswa->waliSiswas as $waliSiswa) {
                $wali = $waliSiswa->wali;
                if (!$wali || !$wali->no_hp) continue;

                $message = "📢 *Konfirmasi Pembayaran*\n\n"
                    . "Halo {$wali->name}, pembayaran untuk siswa *{$pembayaran->tagihan->siswa->nama}* "
                    . "tahun ajaran {$pembayaran->tagihan->tahun_ajaran} telah DIKONFIRMASI oleh admin. ✅\n\n"
                    . "Terima kasih telah melakukan pembayaran. 🙏";

                $response = Http::withHeaders([
                    'Authorization' => env('FONNTE_TOKEN'),
                ])->post('https://api.fonnte.com/send', [
                    'target' => $wali->no_hp,
                    'message' => $message,
                ]);

                Log::info("Kirim pesan konfirmasi ke {$wali->no_hp}: " . $response->body());
            }

            // $pembayaran->tagihan->siswa->notify(new PembayaranKonfirmasiNotification($pembayaran));
            return redirect()->back()->with('success', 'Pembayaran berhasil dikonfirmasi.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $pembayaran = Pembayaran::findOrFail($id);

            // simpan tagihan terkait
            $tagihan = $pembayaran->tagihan;

            // hapus pembayaran
            $pembayaran->delete();

            // cek ulang apakah tagihan masih ada pembayaran lain
            $totalPembayaran = $tagihan->pembayarans()->sum('jumlah_dibayar');
            $totalTagihan = $tagihan->details->sum('jumlah_biaya');

            if ($totalPembayaran <= 0) {
                $tagihan->status = 'baru';
            } elseif ($totalPembayaran < $totalTagihan) {
                $tagihan->status = 'angsur';
            } else {
                $tagihan->status = 'lunas';
            }

            $tagihan->save();

            return redirect()->back()->with('success', 'Data pembayaran berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
