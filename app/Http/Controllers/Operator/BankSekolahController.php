<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Bank;
use App\Models\BankSekolah;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankSekolahController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bank_sekolah = BankSekolah::get();
        $banks = Bank::get();

        return Inertia::render('operator/rekening/index', compact('bank_sekolah', 'banks'));
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
                'bank_id' => 'required',
                'nomor_rekening' => 'required',
                'nama_rekening' => 'required',
            ]);

            $bank = Bank::find($request->bank_id);

            BankSekolah::create([
                'kode' => $bank->code,
                'nama_bank' => $bank->name,
                'nomor_rekening' => $request->nomor_rekening,
                'nama_rekening' => $request->nama_rekening
            ]);

            return redirect()->back()->with('success', 'Rekening berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            // Validasi input
            $request->validate([
                'bank_id'        => 'required',
                'nomor_rekening' => 'required',
                'nama_rekening'  => 'required',
            ]);

            // Ambil data bank yang dipilih
            $bank = Bank::where('code', $request->bank_id)->firstOrFail();

            // Cari record bank_sekolah
            $bankSekolah = BankSekolah::findOrFail($id);

            // Update datanya
            $bankSekolah->update([
                'kode'           => $bank->code,
                'nama_bank'      => $bank->name,
                'nomor_rekening' => $request->nomor_rekening,
                'nama_rekening'  => $request->nama_rekening,
            ]);

            return redirect()->back()->with('success', 'Rekening berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    
    public function destroy(string $id)
    {
        try{
            BankSekolah::where('id', $id)->delete();
            return redirect()->back()->with('success', 'Rekening berhasil dihapus.');
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
     * Remove the specified resource from storage.
     */
}
