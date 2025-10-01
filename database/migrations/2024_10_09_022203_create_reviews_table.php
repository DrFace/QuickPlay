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
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('offer_id')->nullable()->constrained('offers')->onDelete('cascade');
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignUuid('reviewer_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->decimal('recommend_rate')->nullable();
            $table->text('feedback')->nullable();
            $table->string('contract_end_reason')->nullable();
            $table->string('english_proficiency')->nullable();
            $table->decimal('skills_rate')->nullable();
            $table->decimal('quality_rate')->nullable();
            $table->decimal('availability_rate')->nullable();
            $table->decimal('adherence_rate')->nullable();
            $table->decimal('communication_rate')->nullable();
            $table->decimal('cooperation_rate')->nullable();
            $table->decimal('avg_score_rate')->nullable();
            $table->text('your_experience')->nullable();
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
