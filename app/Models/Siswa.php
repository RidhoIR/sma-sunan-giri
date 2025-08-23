<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    protected $fillable = ['nama', 'nisn', 'jurusan', 'kelas', 'angkatan', 'foto'];


    public function waliSiswas()
    {
        return $this->hasMany(WaliSiswa::class);
    }
}
