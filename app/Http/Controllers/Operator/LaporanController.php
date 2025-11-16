<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('operator/laporan/index');
    }

    private function convertMonthNameToNumber(string $monthName): ?int
    {
        $months = [
            'Januari' => 1,
            'Februari' => 2,
            'Maret' => 3,
            'April' => 4,
            'Mei' => 5,
            'Juni' => 6,
            'Juli' => 7,
            'Agustus' => 8,
            'September' => 9,
            'Oktober' => 10,
            'November' => 11,
            'Desember' => 12,
        ];
        return $months[$monthName] ?? null;
    }

    public function generateLaporanTagihan(Request $request)
    {
        $validatedData = $request->validate([
            'angkatan' => 'nullable|string',
            'status_tagihan' => 'nullable|string|in:Lunas,Belum Bayar,angsur',
            'bulan' => 'nullable|string',
            'tahun' => 'nullable|string',
        ]);

        $statusMap = [
            'Lunas' => 'lunas',
            'Belum Bayar' => 'baru',
            'angsur' => 'angsur',
        ];

        $query = Tagihan::query()->with('siswa', 'details', 'pembayarans');

        if ($request->filled('angkatan')) {
            $query->whereHas('siswa', function ($q) use ($validatedData) {
                $q->where('angkatan', $validatedData['angkatan']);
            });
        }

        if ($request->filled('status_tagihan') && isset($statusMap[$validatedData['status_tagihan']])) {
            $query->where('status', $statusMap[$validatedData['status_tagihan']]);
        }

        if ($request->filled(['bulan', 'tahun'])) {
            $bulanAngka = $this->convertMonthNameToNumber($validatedData['bulan']);
            $tahun = $validatedData['tahun'];

            if ($bulanAngka) {
                $query->whereYear('created_at', $tahun)
                    ->whereMonth('created_at', $bulanAngka);
            }
        }

        // Ambil data
        $laporanTagihan = $query->get()->map(function ($tagihan) {
            // Misal: total tagihan dari relasi details (jumlah nominal setiap detail)
            $total = $tagihan->details->sum('jumlah_biaya');
            $tagihan->total_tagihan = $total;
            return $tagihan;
        });

        // Kirim ke Inertia
        $pdf = Pdf::loadView('laporan-tagihan', [
            'laporanTagihan' => $laporanTagihan,
            'filters' => $validatedData,
        ]);

        return $pdf->stream('laporan_tagihan.pdf');
    }

    public function generateLaporanPembayaran(Request $request)
    {
        $validated = $request->validate([
            'angkatan_pembayaran' => 'nullable|string',
            'status_pembayaran' => 'nullable|string|in:Sudah Dikonfirmasi,Belum Dikonfirmasi',
            'bulan_pembayaran' => 'nullable|string',
            'tahun_pembayaran' => 'nullable|string',
        ]);

        $bulanAngka = $this->convertMonthNameToNumber($validated['bulan_pembayaran'] ?? '');
        $tahun = $validated['tahun_pembayaran'] ?? now()->year;

        $query = \App\Models\Pembayaran::query()->with('tagihan.siswa');

        // Filter angkatan siswa
        if ($request->filled('angkatan_pembayaran')) {
            $query->whereHas('tagihan.siswa', function ($q) use ($validated) {
                $q->where('angkatan', $validated['angkatan_pembayaran']);
            });
        }

        // Filter status pembayaran berdasarkan tanggal_konfirmasi
        if ($request->filled('status_pembayaran')) {
            if ($validated['status_pembayaran'] === 'Sudah Dikonfirmasi') {
                $query->whereNotNull('tanggal_konfirmasi');
            } else {
                $query->whereNull('tanggal_konfirmasi');
            }
        }

        // Filter bulan
        if ($bulanAngka) {
            $query->whereMonth('tanggal_pembayaran', $bulanAngka);
        }

        // Filter tahun
        if ($request->filled('tahun_pembayaran')) {
            $query->whereYear('tanggal_pembayaran', $tahun);
        }

        $laporanPembayaran = $query->get();

        $pdf = Pdf::loadView('laporan-pembayaran', [
            'laporanPembayaran' => $laporanPembayaran,
            'filters' => $validated,
        ]);

        return $pdf->stream('laporan_pembayaran.pdf');
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
