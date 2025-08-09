<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Utama',
            'email' => 'admin@gmail.com',
            'no_hp' => '08123456789',
            'akses' => 'admin',
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('123'), // ganti dengan yang aman di production
            'remember_token' => Str::random(10),
        ]);

        // Buat user pengurus
        User::create([
            'name' => 'Subagio',
            'email' => 'walimurid@gmail.com',
            'no_hp' => '08123451089',
            'akses' => 'wali',
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('123'),
            'remember_token' => Str::random(10),
        ]);
    }
}
