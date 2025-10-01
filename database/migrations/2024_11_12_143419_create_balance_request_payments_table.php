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
        Schema::create('balance_request_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('balance_request_id')->constrained('balance_requests')->onDelete('cascade');
            $table->foreignUuid('payment_id')->constrained('payments')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('balance_request_payments');
    }
};
