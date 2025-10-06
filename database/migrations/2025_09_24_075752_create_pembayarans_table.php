<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pembayarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tagihan_id')->constrained('tagihans')->onDelete('cascade');
            $table->foreignId('wali_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('wali_bank_id')->nullable()->constrained('wali_banks')->onDelete('cascade');
            $table->foreignId('bank_sekolah_id')->nullable()->constrained('bank_sekolahs')->onDelete('cascade');
            $table->date('tanggal_pembayaran');
            $table->string('status_konfirmasi')->nullable();
            $table->dateTime('tanggal_konfirmasi')->nullable();
            $table->bigInteger('jumlah_dibayar');
            $table->string('bukti_pembayaran')->nullable();
            $table->string('metode_pembayaran')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pembayarans');
    }
};
