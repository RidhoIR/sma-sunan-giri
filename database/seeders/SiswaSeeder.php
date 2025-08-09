<?php

namespace Database\Seeders;

use App\Models\Siswa;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiswaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $siswas = [
            [
                'nama' => 'Ahmad Ridho',
                'nisn' => '1234567890',
                'jurusan' => 'IPA',
                'kelas' => '11',
                'angkatan' => '2022',
            ],
            [
                'nama' => 'Dina Aulia',
                'nisn' => '0987654321',
                'jurusan' => 'IPS',
                'kelas' => '11',
                'angkatan' => '2023',
            ],
            [
                'nama' => 'Fahmi Nur',
                'nisn' => '1122334455',
                'jurusan' => 'IPA',
                'kelas' => '12',
                'angkatan' => '2024',
            ],
        ];

        foreach ($siswas as $siswa) {
            Siswa::create($siswa);
        }
    }
}
