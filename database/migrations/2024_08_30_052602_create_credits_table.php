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
        Schema::create('credits', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->decimal('connects')->nullable();
            $table->decimal('available_connects')->nullable();
            $table->decimal('amount', 8, 2)->nullable();
            $table->decimal('tax', 8, 2)->nullable();
            $table->timestamp('expire_date')->nullable();
            $table->enum('status', ['active', 'expire', 'draft', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credits');
    }
};
