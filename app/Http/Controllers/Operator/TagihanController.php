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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TagihanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tagihan = Tagihan::with('siswa', 'user')->get();

        return Inertia::render('operator/tagihan/index', [
            'tagihan' => $tagihan
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

                foreach ($siswas as $siswa) {
                    // 1️⃣ Buat tagihan untuk siswa ini
                    $tagihan = Tagihan::create([
                        'user_id' => Auth::user()->id, // atau sesuai kebutuhan
                        'siswa_id' => $siswa->id,
                        'angkatan' => $request->angkatan ?? $siswa->angkatan ?? null,
                        'kelas' => $request->kelas ?? $siswa->kelas ?? null,
                        'tanggal_tagihan' => $request->tanggal_tagihan,
                        'tanggal_jatuh_tempo' => $request->tanggal_jatuh_tempo,
                        'keterangan' => $request->keterangan ?? null,
                        'denda' => null,
                        'status' => 'ok',
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


        return Inertia::render('operator/tagihan/detail', [
            'tagihan_details' => $tagihan_details,
            'tagihan_detail'  => $tagihan_detail,
            'pembayaran' => $pembayaran
        ]);
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
