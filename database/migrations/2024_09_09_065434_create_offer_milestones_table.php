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
        Schema::create('offer_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('offer_id')->nullable()->constrained('offers')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->enum('status', ['draft', 'active', 'paid', 'completed', 'requested', 'inactive'])->default('draft');
            $table->enum('project_status', ['pending', 'uploaded', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offer_milestones');
    }
};
