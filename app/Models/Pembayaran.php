<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pembayaran extends Model
{
    protected $guarded = ['id'];

    protected $appends = ['status_konfirmasi'];

    public function getStatusKonfirmasiAttribute()
    {
        // misalnya: kalau tanggal_konfirmasi null = belum, kalau ada = sudah
        return $this->tanggal_konfirmasi ? 'Sudah Dikonfirmasi' : 'Belum Dikonfirmasi';
    }

    public function tagihan()
    {
        return $this->belongsTo(Tagihan::class);
    }

    public function wali()
    {
        return $this->belongsTo(User::class, 'wali_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function waliBank()
    {
        return $this->belongsTo(WaliBank::class);
    }

    public function bankSekolah()
    {
        return $this->belongsTo(BankSekolah::class);
    }
}
