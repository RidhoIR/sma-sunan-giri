<?php

namespace Database\Seeders;

use App\Models\Biaya;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BiayaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $biayas = [
            [
                'nama' => 'SPP Bulanan',
                'jumlah' => 250000,
                'user_id' => 1,
            ],
        ];

        foreach ($biayas as $biaya) {
            Biaya::create($biaya);  
        }
    }
}
