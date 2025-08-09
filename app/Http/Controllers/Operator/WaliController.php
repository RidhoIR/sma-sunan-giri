<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\User;
use App\Models\WaliSiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class WaliController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $wali = User::where('akses', 'wali')->get();

        return Inertia::render('operator/wali/index', [
            'wali' => $wali
        ]);
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'no_hp' => ['required', 'string', 'max:15'],
                'password' => ['required', 'min:6', 'confirmed'],
            ]);

            User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'no_hp' => $validated['no_hp'],
                'password' => Hash::make($validated['password']),
                'akses' => 'wali',
            ]);

            return redirect()->back()->with('success', 'Wali Murid berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function storeWaliSiswa(Request $request, string $id) {
        try {
            $validated = $request->validate([
                'siswa_id' => ['required', 'exists:siswas,id'],
            ]);

            $wali_id = User::findorfail($id);

            WaliSiswa::create([
                'siswa_id' => $validated['siswa_id'],
                'wali_id' => $wali_id->id,
                'status' => 'ok',
            ]);

            return redirect()->back()->with('success', 'Siswa(Anak) berhasil ditambahkan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    public function update(Request $request, string $id)
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email,' . $id],
                'no_hp' => ['required', 'string', 'max:15'],
                'password' => ['nullable', 'min:6', 'confirmed'],
            ]);

            $user = User::findOrFail($id);
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'no_hp' => $validated['no_hp'],
                'password' => $validated['password'] ? Hash::make($validated['password']) : $user->password,
            ]);

            return redirect()->back()->with('success', 'Wali Murid berhasil diperbarui.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }



    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return redirect()->back()->with('success', 'Wali Murid berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show(string $id)
    {
        try {
            $user = User::findOrFail($id);

            $siswaDimiliki = WaliSiswa::where('wali_id', $user->id)
                ->pluck('siswa_id');

            $siswaBelumDimiliki = Siswa::whereNotIn('id', $siswaDimiliki)->get();

            $wali_siswa = WaliSiswa::with(['siswa', 'wali'])->where('wali_id', $user->id)->get();
            return Inertia::render('operator/wali/detail', [
                'wali_siswa' => $wali_siswa,
                'wali' => $user,
                'siswa_belum_dimiliki' => $siswaBelumDimiliki,
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
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
