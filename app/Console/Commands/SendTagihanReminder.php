<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Tagihan;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendTagihanReminder extends Command
{
    protected $signature = 'reminder:tagihan';
    protected $description = 'Kirim pesan WA otomatis untuk tagihan mendekati jatuh tempo';

    public function handle()
    {
        $today = Carbon::today();
        $reminderDate = $today->copy()->addDays(3);

        // Ambil tagihan yang mendekati jatuh tempo dan belum lunas
        $tagihans = Tagihan::with([
            'siswa.waliSiswas.wali', // ambil wali dari siswa
        ])
            ->whereDate('tanggal_jatuh_tempo', '<=', $reminderDate)
            ->where('status', '!=', 'lunas')
            ->get();
        Log::info('Jumlah tagihan yang ditemukan: ' . $tagihans->count());

        if ($tagihans->isEmpty()) {
            $this->info('Tidak ada tagihan yang mendekati jatuh tempo.');
            return;
        }

        foreach ($tagihans as $tagihan) {
            $siswa = $tagihan->siswa;
            if (!$siswa) continue;

            foreach ($siswa->waliSiswas as $waliSiswa) {
                $wali = $waliSiswa->wali;
                if (!$wali || !$wali->no_hp) continue;

                $message = "Halo {$wali->name}, ini pengingat bahwa tagihan untuk siswa *{$siswa->nama}* "
                    . "tahun ajaran {$tagihan->tahun_ajaran} "
                    . "akan jatuh tempo pada "
                    . Carbon::parse($tagihan->tanggal_jatuh_tempo)->translatedFormat('d F Y') . ".\n\n"
                    . "Mohon segera lakukan pembayaran sebelum tanggal tersebut. Terima kasih 🙏";
                Log::info("Mengirim reminder ke {$wali->name} ({$wali->no_hp}) untuk siswa {$siswa->nama}");

                // Kirim pesan via Fonnte
                $response = Http::withHeaders([
                    'Authorization' => env('FONNTE_TOKEN'),
                ])->post('https://api.fonnte.com/send', [
                    'target' => $wali->no_hp,
                    'message' => $message,
                ]);
                Log::info('Respons Fonnte:', $response->json());


                if ($response->failed()) {
                    Log::error("Gagal mengirim pesan ke {$wali->name} ({$wali->phone}): " . $response->body());
                }
            }
        }

        $this->info("Pesan pengingat tagihan berhasil dikirim ke semua wali siswa yang mendekati jatuh tempo.");
    }
}
