<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Tagihan;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PembayaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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

            Pembayaran::create([
                'tagihan_id' => $validated['tagihan_id'],
                'user_id' => Auth::user()->id,
                'status_konfirmasi' => 'sudah',
                'jumlah_dibayar' => $validated['jumlah_dibayar'],
                'metode_pembayaran' => 'manual',
                'tanggal_pembayaran' => $validated['tanggal_pembayaran'],
            ]);

            return redirect()->back()->with('success', 'Pembayaran berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function cetakInvoice($id)
    {
        $pembayaran = Pembayaran::with(['tagihan.siswa'])->findOrFail($id);

        $pdf = Pdf::loadView('invoice-pembayaran', compact('pembayaran'))
            ->setPaper('A5', 'portrait'); // ukuran A5 seperti kwitansi

        return $pdf->stream('kwitansi-' . $pembayaran->id . '.pdf');
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
