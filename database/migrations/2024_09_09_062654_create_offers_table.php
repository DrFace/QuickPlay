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
        Schema::create('offers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignUuid('job_post_id')->constrained('job_posts')->onDelete('cascade');
            $table->foreignUuid('proposal_id')->constrained('proposals')->onDelete('cascade');
            $table->decimal('offer_price', 8, 2)->nullable();
            $table->string('payment_type')->nullable();
            $table->string('contract_title')->nullable();
            $table->text('contract_description')->nullable();
            $table->enum('status', ['draft', 'pending', 'accepted', 'completed', 'rejected', 'cancelled'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
