<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Siswa;
use App\Models\User;
use App\Models\WaliSiswa;

class WaliSiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua siswa dan wali (user dengan role 'wali')
        $siswas = Siswa::all();
        $walis = User::where('akses', 'wali')->get();

        // Jika tidak ada wali atau siswa, tidak perlu melanjutkan
        if ($walis->isEmpty() || $siswas->isEmpty()) {
            $this->command->warn('Tidak ada data siswa atau wali yang ditemukan. Seeder dilewati.');
            return;
        }

        // Assign wali secara acak ke setiap siswa
        foreach ($siswas as $siswa) {
            WaliSiswa::create([
                'siswa_id' => $siswa->id,
                'wali_id' => $walis->random()->id,
                'status' => 'ok'
            ]);
        }
    }
}
