<?php

namespace App\Http\Controllers\Wali;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;
use App\Models\Tagihan;
use App\Models\User;
use App\Notifications\PembayaranNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PaymentGatewayController extends Controller
{
    public function createSnapToken(Request $request)
    {
        try {
            Log::info('=== CREATE SNAP TOKEN START ===');
            Log::info('Request data:', $request->all());

            // Validasi input
            $request->validate([
                'tagihan_id' => 'required|exists:tagihans,id',
            ]);

            // Ambil data tagihan
            $tagihan = Tagihan::with(['siswa', 'details', 'pembayarans'])->findOrFail($request->tagihan_id);

            Log::info('Tagihan found:', ['id' => $tagihan->id, 'siswa' => $tagihan->siswa->nama]);

            $totalTagihan = $tagihan->details->sum('jumlah_biaya');
            $totalDibayar = $tagihan->pembayarans->sum('jumlah_dibayar');
            $sisaBayar = $totalTagihan - $totalDibayar;

            Log::info('Calculation:', [
                'totalTagihan' => $totalTagihan,
                'totalDibayar' => $totalDibayar,
                'sisaBayar' => $sisaBayar
            ]);

            $grossAmount = $sisaBayar;

            if ($grossAmount <= 0) {
                Log::warning('Invalid gross amount:', ['amount' => $grossAmount]);
                return response()->json(['error' => 'Jumlah tagihan tidak valid atau sudah lunas'], 400);
            }

            // Konfigurasi Midtrans
            Config::$serverKey = config('midtrans.server_key');
            Config::$isProduction = config('midtrans.is_production', false);
            Config::$isSanitized = true;
            Config::$is3ds = true;

            Log::info('Midtrans config:', [
                'serverKey' => substr(config('midtrans.server_key'), 0, 10) . '...',
                'isProduction' => config('midtrans.is_production'),
                'clientKey' => substr(config('midtrans.client_key'), 0, 10) . '...'
            ]);

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
                'item_details' => [
                    [
                        'id' => 'SISA-' . $tagihan->id,
                        'price' => (int) $grossAmount,
                        'quantity' => 1,
                        'name' => 'Pembayaran Sisa Tagihan #' . $tagihan->id,
                    ]
                ],
            ];

            Log::info('Creating Snap Token with params:', $params);

            $snapToken = Snap::getSnapToken($params);

            Log::info('✅ Snap Token created successfully:', ['token' => substr($snapToken, 0, 20) . '...']);

            return response()->json([
                'success' => true,
                'snapToken' => $snapToken,
                'clientKey' => config('midtrans.client_key'),
                'debug' => [
                    'gross_amount' => $grossAmount,
                    'order_id' => $params['transaction_details']['order_id']
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Validation Error', ['errors' => $e->errors()]);
            return response()->json([
                'error' => 'Validasi gagal',
                'details' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('❌ Snap Token Error', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Gagal membuat Snap Token',
                'message' => $e->getMessage(),
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
                    $pembayaran = Pembayaran::create([
                        'wali_id' => Auth::user()->id,
                        'tagihan_id' => $tagihan->id,
                        'jumlah_dibayar' => $gross,
                        'tanggal_pembayaran' => now(),
                        'metode_pembayaran' => 'midtrans',
                    ]);
                } catch (\Exception $e) {
                    Log::error('Error creating pembayaran', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                    return response()->json(['message' => 'Error creating pembayaran'], 500);
                }
                // Buat record pembayaran baru
            }
            $userOperator = User::where('akses', 'admin')->get();

            foreach ($userOperator as $operator) {
                $operator->notify(new PembayaranNotification($pembayaran));
            }
            return response()->json(['message' => 'Callback processed']);
        } catch (\Exception $e) {
            Log::error('Midtrans callback error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Callback error'], 500);
        }
    }
}
