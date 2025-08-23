<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SiswaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $siswa = Siswa::get();

        return Inertia::render('operator/siswa/index', [
            'siswa' => $siswa
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
                'nama' => 'required|string|max:255',
                'nisn' => 'required|string|max:50|unique:siswas,nisn',
                'jurusan' => 'required|string|max:100',
                'kelas' => 'required|string|max:50',
                'angkatan' => 'required|string|max:50',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // validasi foto
            ]);

            if ($request->hasFile('foto')) {
                $foto = $request->file('foto');

                // buat nama file unik: timestamp + original name
                $filename = time() . '_' . $foto->getClientOriginalName();

                // simpan ke storage/app/public/fotos
                $path = $foto->storeAs('fotos', $filename, 'public');

                // simpan ke field foto
                $validated['foto'] = $path;
            }

            Siswa::create($validated);

            return redirect()->back()->with('success', 'Data siswa berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }


    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'nisn' => 'required|string|max:50',
                'jurusan' => 'required|string|max:100',
                'kelas' => 'required|string|max:50',
                'angkatan' => 'required|string|max:50',
                'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            $siswa = Siswa::findOrFail($id);

            $siswa->nama = $validated['nama'];
            $siswa->nisn = $validated['nisn'];
            $siswa->jurusan = $validated['jurusan'];
            $siswa->kelas = $validated['kelas'];
            $siswa->angkatan = $validated['angkatan'];

            if ($request->hasFile('foto')) {
                if ($siswa->foto && Storage::disk('public')->exists($siswa->foto)) {
                    Storage::disk('public')->delete($siswa->foto);
                }

                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();

                // simpan file ke storage/fotos
                $path = $file->storeAs('fotos', $filename, 'public');

                $siswa->foto = $path;
            }

            $siswa->save();

            return redirect()->back()->with('success', 'Data siswa berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show(string $id)
    {
        $siswa = Siswa::findOrFail($id);
        $wali_siswa = WaliSiswa::with(['siswa', 'wali', 'user'])->where('siswa_id', $siswa->id)->get();

        return Inertia::render('operator/siswa/detail', [
            'siswa' => $siswa,
            'wali_siswa' => $wali_siswa
        ]);
    }

    public function destroy(string $id)
    {
        try {
            $siswa = Siswa::findOrFail($id);

            $siswa->delete();

            return redirect()->back()->with('success', 'Data siswa berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    /**
     * Display the specified resource.
     */


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

    /**
     * Remove the specified resource from storage.
     */
}
