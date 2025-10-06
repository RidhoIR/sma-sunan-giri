<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankSekolah extends Model
{
    protected $guarded = ['id'];



    public function pembayarans()
    {
        return $this->hasMany(Pembayaran::class);
    }
}
