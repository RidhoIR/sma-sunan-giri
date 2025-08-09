<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaliSiswa extends Model
{
    protected $guarded = ['id'];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    public function wali()
    {
        return $this->belongsTo(User::class, 'wali_id');
    }
}
