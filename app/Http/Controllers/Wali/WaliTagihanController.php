<?php

namespace App\Http\Controllers\Wali;

use App\Http\Controllers\Controller;
use App\Models\BankSekolah;
use Illuminate\Support\Facades\Auth;
use App\Models\Tagihan;
use App\Models\TagihanDetail;
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

        $tagihan = Tagihan::with(['siswa','pembayarans', 'latestPembayaran'])->whereIn('siswa_id', $siswaIds)->get();

        return Inertia::render('wali/tagihan/index', compact('tagihan'));
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

        return Inertia::render('wali/tagihan/detail', compact('tagihan_details', 'tagihan_detail', 'bank_sekolah'));
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
