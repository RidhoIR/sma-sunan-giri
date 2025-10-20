<?php

namespace App\Http\Controllers\Wali;

use App\Http\Controllers\Controller;
use App\Models\BankSekolah;
use Illuminate\Support\Facades\Auth;
use App\Models\Tagihan;
use App\Models\TagihanDetail;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

use Illuminate\Http\Request;

class WaliTagihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wali = Auth::user();

        $siswaIds = $wali->waliSiswas()->pluck('siswa_id');

        $tagihans = Tagihan::with(['siswa', 'details', 'pembayarans', 'latestPembayaran'])
            ->whereIn('siswa_id', $siswaIds)
            ->get()
            ->map(function ($tagihan) {
                // Total biaya dari detail tagihan
                $totalTagihan = $tagihan->details->sum('jumlah_biaya');

                // Total yang sudah dibayar
                $totalDibayar = $tagihan->pembayarans->sum('jumlah_dibayar');

                // Hitung sisa bayar
                $sisaBayar = $totalTagihan - $totalDibayar;

                // Simpan ke properti tambahan
                $tagihan->totalTagihan = $totalTagihan;
                $tagihan->totalDibayar = $totalDibayar;
                $tagihan->sisaBayar = $sisaBayar;

                return $tagihan;
            });

        return Inertia::render('wali/tagihan/index', [
            'tagihan' => $tagihans
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $wali = Auth::user();

        $siswaIds = $wali->waliSiswas()->pluck('siswa_id');

        $tagihan_details = TagihanDetail::with(['tagihan', 'tagihan.siswa'])
            ->where('tagihan_id', $id)
            ->whereHas('tagihan', function ($q) use ($siswaIds) {
                $q->whereIn('siswa_id', $siswaIds);
            })
            ->get();

        if ($tagihan_details->isEmpty()) {
            abort(404);
        }

        $tagihan_detail = $tagihan_details->first();

        $bank_sekolah = BankSekolah::get();

        $total_tagihan = $tagihan_details->sum('jumlah_biaya');

        $totalDibayar = $tagihan_detail->tagihan->pembayarans->sum('jumlah_dibayar');

        $sisaBayar = $total_tagihan - $totalDibayar;

        return Inertia::render('wali/tagihan/detail', compact('tagihan_details', 'tagihan_detail', 'bank_sekolah', 'total_tagihan', 'totalDibayar', 'sisaBayar'));
    }

    public function invoice($id)
    {
        $tagihan_details = TagihanDetail::with(['tagihan', 'tagihan.siswa'])
            ->where('tagihan_id', $id)
            ->get();
        $tagihan_detail = $tagihan_details->first();
        // dd($tagihan_detail);

        $pdf = Pdf::loadView('invoice-tagihan', compact('tagihan_details', 'tagihan_detail'))
            ->setPaper('A5', 'portrait'); // ukuran A5 seperti kwitansi

        return $pdf->stream('invoice-' . $tagihan_detail->tagihan->siswa->id . '.pdf');
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
