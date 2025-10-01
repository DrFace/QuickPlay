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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('offer_id')->nullable()->constrained('offers')->onDelete('cascade');
            $table->foreignUuid('freelancer_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignUuid('client_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('type', ['fixed', 'milestone'])->default('fixed');
            $table->enum('status', ['draft', 'uploaded', 'rejected', 'completed'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
