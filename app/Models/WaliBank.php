<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WaliBank extends Model
{
    protected $guarded = ['id'];

    public function wali()
    {
        return $this->belongsTo(User::class, 'wali_id');
    }

    public function pembayarans()
    {
        return $this->hasMany(Pembayaran::class);
    }
}
