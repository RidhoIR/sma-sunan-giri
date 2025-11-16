<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Siswa;
use App\Models\Tagihan;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WaliDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wali = Auth::user();

        $siswaIds = $wali->waliSiswas()->pluck('siswa_id');

        $totalSiswa = WaliSiswa::where('wali_id', Auth::user()->id)->count();
        $totalPembayaran = Pembayaran::count();
        $jumlahPembayaran = Pembayaran::where('wali_id', Auth::user()->id)
            ->where('tanggal_konfirmasi', '!=', null)
            ->sum('jumlah_dibayar');
        $unreadNotifications = Auth::user()->unreadNotifications()->count();
        $lunas = Tagihan::with('siswa')->whereIn('siswa_id', $siswaIds)->where('status', 'lunas')->count();
        $belum_lunas = Tagihan::with('siswa')->whereIn('siswa_id', $siswaIds)->where('status', 'angsur')->count();
        $belum_bayar = Tagihan::with('siswa')->whereIn('siswa_id', $siswaIds)->where('status', 'baru')->count();
        $sudah_dikonfirmasi = Pembayaran::where('wali_id', Auth::user()->id)->where('tanggal_konfirmasi', '!=', null)->count();
        $belum_dikonfirmasi = Pembayaran::where('wali_id', Auth::user()->id)->where('tanggal_konfirmasi', null)->count();
        return Inertia::render(
            'dashboard-wali',
            [
                'totalSiswa' => $totalSiswa,
                'totalPembayaran' => $totalPembayaran,
                'jumlahPembayaran' => $jumlahPembayaran,
                'unreadNotifications' => $unreadNotifications,
                'tagihanStats' => [
                    'lunas' => $lunas,
                    'belum_lunas' => $belum_lunas,
                    'belum_bayar' => $belum_bayar,
                ],
                'pembayaranStats' => [
                    'sudah_dikonfirmasi' => $sudah_dikonfirmasi,
                    'belum_dikonfirmasi' => $belum_dikonfirmasi,
                ],
            ],
        );
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
