<?php

namespace App\Http\Controllers\Wali;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\BankSekolah;
use App\Models\Tagihan;
use App\Models\WaliBank;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Pembayaran;
use App\Models\User;
use App\Notifications\PembayaranNotification;

class WaliPembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pembayaran = Pembayaran::where('wali_id', Auth::user()->id)
        ->with(['tagihan', 'tagihan.siswa', 'wali', 'user', 'bankSekolah'])
        ->latest()
        ->orderBy('tanggal_pembayaran', 'desc')
        ->get();        

        return Inertia::render('wali/pembayaran/index', [
            'pembayaran' => $pembayaran
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $wali = Auth::user()->id;
        $wali_bank = WaliBank::where('wali_id', $wali)->get();
        $tagihan = Tagihan::where('id', $request->tagihan_id)->first();
        $bank_sekolah = BankSekolah::findorfail($request->bank_sekolah_id);
        $list_bank = BankSekolah::get();
        $banks = Bank::get();

        // if($request->bank_sekolah_id != ''){
        //     $bank_dipilih = BankSekolah::findorfail($request->bank_sekolah_id);
        // }

        return Inertia::render('wali/tagihan/payment', [
            'tagihan' => $tagihan,
            'bank_sekolah' => $bank_sekolah,
            'list_bank' => $list_bank,
            'banks' => $banks,
            'wali_bank' => $wali_bank
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'tanggal_pembayaran' => 'required|date',
                'jumlah_pembayaran' => 'required|numeric',
                'bank_sekolah_id' => 'required|exists:bank_sekolahs,id', // bank tujuan
                'bukti_pembayaran' => 'required|file|mimes:jpg,jpeg,png,pdf',
            ]);

            $validasiPembayaran = Pembayaran::where('jumlah_dibayar', $request->jumlah_pembayaran)
                ->where('tagihan_id', $request->tagihan_id)
                ->where('tanggal_konfirmasi', null)
                ->first();

            if ($validasiPembayaran != null) {
                return redirect()->back()->with('error', 'Pembayaran ini sudah ada dan akan segera di konfirmasi oleh admin operator');
            }


            // jika pakai bank lama
            if ($request->filled('wali_bank_id')) {
                $waliBank = WaliBank::findOrFail($request->wali_bank_id);
            }

            // jika pakai bank baru
            if ($request->filled('bank_baru_id')) {
                $bank = Bank::findOrFail($request->bank_baru_id);

                $bankWaliData = $request->validate([
                    'nama_rekening' => 'required|string',
                    'nomor_rekening' => 'required|string',
                ]);

                $waliBank = WaliBank::firstOrCreate(
                    [
                        'wali_id' => Auth::id(),
                        'nomor_rekening' => $bankWaliData['nomor_rekening'],
                    ],
                    [
                        'nama_rekening' => $bankWaliData['nama_rekening'],
                        'kode' => $bank->code,
                        'nama_bank' => $bank->name,
                    ]
                );
            }

            // upload bukti pembayaran
            $path = $request->file('bukti_pembayaran')->store('bukti_pembayaran', 'public');

            // simpan pembayaran (contoh)
            $pembayaran = Pembayaran::create([
                'tagihan_id' => $request->tagihan_id,
                'wali_id' => Auth::id(),
                'wali_bank_id' => $waliBank->id ?? null,
                'bank_sekolah_id' => $request->bank_sekolah_id,
                'tanggal_pembayaran' => $validated['tanggal_pembayaran'],
                'jumlah_dibayar' => $validated['jumlah_pembayaran'],
                'bukti_pembayaran' => $path,
                'metode_pembayaran' => 'transfer',
                // 'status_konfirmasi' => 'belum',
                'user_id' => null,
            ]);

            $userOperator = User::where('akses', 'admin')->get();

            foreach ($userOperator as $operator) {
                $operator->notify(new PembayaranNotification($pembayaran));
            }

            return redirect()->back()->with('success', 'Pembayaran berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
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

        return Inertia::render('wali/pembayaran/detail', [
            'pembayaran' => $pembayaran
        ]);
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
        //
    }
}
