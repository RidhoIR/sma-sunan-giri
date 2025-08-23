<?php

namespace Database\Seeders;

use App\Models\Siswa;
use App\Models\Tagihan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TagihanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();
        $siswa = Siswa::first();

        if (!$user || !$siswa) {
            $this->command->warn('Tidak ada user atau siswa di database. Seeder Tagihan dilewati.');
            return;
        }

        Tagihan::create([
            'user_id' => $user->id,
            'siswa_id' => $siswa->id,
            'angkatan' => 2023,
            'kelas' => 'XII IPA 1',
            'tanggal_tagihan' => Carbon::now()->toDateString(),
            'tanggal_jatuh_tempo' => Carbon::now()->addDays(7)->toDateString(),
            'keterangan' => 'SPP Bulanan',
            'denda' => 0,
            'status' => 'belum_lunas',
        ]);

    }
}
