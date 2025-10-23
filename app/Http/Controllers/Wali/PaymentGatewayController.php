<?php

namespace App\Http\Controllers\Wali;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use App\Models\Tagihan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentGatewayController extends Controller
{
    public function createSnapToken(Request $request)
    {
        try {
            // Validasi input
            $request->validate([
                'tagihan_id' => 'required|exists:tagihans,id',
            ]);

            // Ambil data tagihan
            $tagihan = Tagihan::with(['siswa', 'details'])->findOrFail($request->tagihan_id);

            // Hitung total
            $grossAmount = $tagihan->details->sum('jumlah_biaya');

            if ($grossAmount <= 0) {
                return response()->json(['error' => 'Jumlah tagihan tidak valid'], 400);
            }

            // Konfigurasi Midtrans
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production', false);
            Config::$isSanitized = true;
            Config::$is3ds = true;

            // Data transaksi
            $params = [
                'transaction_details' => [
                    'order_id' => 'INV-' . $tagihan->id . '-' . time(),
                    'gross_amount' => (int) $grossAmount,
                ],
                'customer_details' => [
                    'first_name' => $tagihan->siswa->nama,
                    'email' => $tagihan->siswa->email ?? 'noemail@example.com',
                    'phone' => $tagihan->siswa->no_telp ?? '081234567890',
                ],
                'item_details' => $tagihan->details->map(function ($detail) {
                    return [
                        'id' => $detail->id,
                        'price' => (int) $detail->jumlah_biaya,
                        'quantity' => 1,
                        'name' => $detail->nama_biaya,
                    ];
                })->toArray(),
            ];

            Log::info('Creating Snap Token', ['params' => $params]);

            $snapToken = Snap::getSnapToken($params);

            return response()->json([
                'snapToken' => $snapToken,
                'clientKey' => config('midtrans.client_key'),
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validasi gagal',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Snap Token Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Gagal membuat Snap Token: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function callback(Request $request)
    {
        try {
            $orderId = $request->input('order_id');
            $status = $request->input('status');
            $gross = $request->input('gross_amount');

            $tagihan_id = explode('-', $orderId)[1] ?? null;

            if (!$tagihan_id) return response()->json(['error' => 'Invalid order id'], 400);

            $tagihan = Tagihan::find($tagihan_id);
            if (!$tagihan) return response()->json(['error' => 'Tagihan not found'], 404);

            if (!$tagihan) {
                return response()->json(['message' => 'Tagihan not found'], 404);
            }

            // Jika pembayaran berhasil
            if ($status === 'settlement') {
                $tagihan->status = 'lunas';
                $tagihan->save();

                try {
                    Pembayaran::create([
                    'wali_id' => Auth::user()->id,
                    'tagihan_id' => $tagihan->id,
                    'jumlah_dibayar' => $gross,
                    'tanggal_konfirmasi' => now(),
                    'tanggal_pembayaran' => now(),
                    'metode_pembayaran' => 'midtrans',
                ]);
                } catch (\Exception $e) {
                    Log::error('Error creating pembayaran', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                    return response()->json(['message' => 'Error creating pembayaran'], 500);
                }
                // Buat record pembayaran baru
                
            }

            return response()->json(['message' => 'Callback processed']);
        } catch (\Exception $e) {
            Log::error('Midtrans callback error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Callback error'], 500);
        }
    }
}
