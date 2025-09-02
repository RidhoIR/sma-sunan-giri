<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use App\Models\Biaya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BiayaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $biaya = Biaya::with('user')->get();
        return Inertia::render('operator/biaya/index', [
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
        try{
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'jumlah' => 'required|numeric',
            ]);

            Biaya::create([
                'nama' => $validated['nama'],
                'jumlah' => $validated['jumlah'],
                'user_id' => Auth::user()->id,
            ]);

            return redirect()->route('admin.biaya.index')->with('success', 'Biaya berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
    
    public function update(Request $request, string $id)
    {
        try{
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'jumlah' => 'required|numeric',
            ]);

            Biaya::where('id', $id)->update([
                'nama' => $validated['nama'],
                'jumlah' => $validated['jumlah'],
                'user_id' => Auth::user()->id,
            ]);

            return redirect()->back()->with('success', 'Biaya berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }


    public function destroy(string $id)
    {
        try{
            Biaya::where('id', $id)->delete();
            return redirect()->back()->with('success', 'Biaya berhasil dihapus.');
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
     * Update the specified resource in storage.
     */

    /**
     * Remove the specified resource from storage.
     */
}
