<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = include __DIR__ . '/data/bank.php';
        foreach ($banks as $bank) {
            DB::table('banks')->updateOrInsert(
                ['code' => $bank['code']],
                ['name' => $bank['name']]
            );
        }
    }
}
