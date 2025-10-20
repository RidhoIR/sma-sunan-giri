<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Siswa;
use App\Models\Biaya;
use App\Models\Pembayaran;
use App\Models\TagihanDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TagihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Ambil data tagihan dengan filter bulan dan tahun jika ada
        $query = Tagihan::with(['siswa', 'user', 'pembayarans', 'details']);

        if ($request->filled('bulan') && $request->filled('tahun')) {
            $query->whereMonth('tanggal_tagihan', $request->bulan)
                ->whereYear('tanggal_tagihan', $request->tahun);
        }

        $tagihan = $query->get();

        // Tambahkan atribut total_dibayar dan sisa_tagihan untuk tiap tagihan
        $tagihan = $tagihan->map(function ($item) {
            $totalTagihan = $item->details->sum('jumlah_biaya');
            $totalDibayar = $item->pembayarans->sum('jumlah_dibayar');
            $sisaTagihan  = max($totalTagihan - $totalDibayar, 0); // biar nggak minus

            $item->totalDibayar = $totalDibayar;
            $item->sisaBayar = $sisaTagihan;
            return $item;
        });

        $biaya = Biaya::get();

        return Inertia::render('operator/tagihan/index', [
            'tagihan' => $tagihan,
            'biaya' => $biaya,
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
            $request->validate([
                'angkatan' => 'nullable|integer',
                'kelas' => 'nullable|string',
                'tanggal_tagihan' => 'nullable|date',
                'tanggal_jatuh_tempo' => 'nullable|date',
                'keterangan' => 'nullable|string',
                'denda' => 'nullable|integer',
                'status' => 'nullable|string',
                'biaya_id' => 'required|array|min:1',
                'biaya_id.*' => 'exists:biayas,id',
            ]);

            DB::transaction(function () use ($request) {
                // Ambil semua siswa
                $siswas = Siswa::all();

                // Ambil semua biaya yang dipilih
                $biayas = Biaya::whereIn('id', $request->biaya_id)->get();

                // Ambil tahun ajaran sesuai biaya yang dipilih
                $biaya_tahun_ajaran = $biayas->first()->tahun_ajaran;

                foreach ($siswas as $siswa) {
                    // 1️⃣ Buat tagihan untuk siswa ini
                    $tagihan = Tagihan::create([
                        'user_id' => Auth::user()->id, // atau sesuai kebutuhan
                        'siswa_id' => $siswa->id,
                        'tahun_ajaran' => $biaya_tahun_ajaran,
                        'tanggal_tagihan' => $request->tanggal_tagihan,
                        'tanggal_jatuh_tempo' => $request->tanggal_jatuh_tempo,
                        'keterangan' => $request->keterangan ?? null,
                        'denda' => null,
                        'status' => 'baru',
                    ]);

                    // 2️⃣ Buat detail tagihan dari biaya yang dipilih
                    foreach ($biayas as $biaya) {
                        $tagihan->details()->create([
                            'nama_biaya' => $biaya->nama,
                            'jumlah_biaya' => $biaya->jumlah,
                        ]);
                    }
                }
            });

            return redirect()->back()->with('success', 'Tagihan untuk semua siswa berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tagihan_details = TagihanDetail::with(['tagihan', 'tagihan.siswa'])
            ->where('tagihan_id', $id)
            ->get();

        $tagihan_detail = $tagihan_details->first();
        $pembayaran = Pembayaran::with('tagihan')->where('tagihan_id', $id)->get();

        $total_tagihan = $tagihan_details->sum('jumlah_biaya');
        $totalDibayar = $tagihan_detail->tagihan->pembayarans->sum('jumlah_dibayar');
        $sisaBayar = $total_tagihan - $totalDibayar;


        return Inertia::render('operator/tagihan/detail', [
            'tagihan_details' => $tagihan_details,
            'tagihan_detail'  => $tagihan_detail,
            'pembayaran' => $pembayaran,
            'totalDibayar' => $totalDibayar,
            'sisaBayar' => $sisaBayar,
        ]);
    }

    public function cetakSPP(Request $request, $id)
    {
        $tagihan = Tagihan::with(['details', 'siswa'])
            ->where('siswa_id', $id)
            ->whereYear('tanggal_tagihan', $request->tahun)
            ->get();

        if ($tagihan->isEmpty()) {
            return back()->with('error', 'Tidak ada tagihan untuk siswa ini pada tahun yang dipilih.');
        }

        // Ambil data siswa dari salah satu tagihan (semua sama)
        $siswa = $tagihan->first()->siswa;

        $pdf = Pdf::loadView('kartu-spp', compact('tagihan', 'siswa'))
            ->setPaper('A5', 'portrait'); // ukuran A5 seperti kwitansi

        return $pdf->stream('kwitansi-' . $siswa->id . '.pdf');
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
