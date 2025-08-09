<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Siswa extends Model
{
    protected $guarded = ['id'];

    public function waliSiswas()
    {
        return $this->hasMany(WaliSiswa::class);
    }
}
