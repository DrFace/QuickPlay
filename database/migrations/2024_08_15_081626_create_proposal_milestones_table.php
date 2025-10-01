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
        Schema::create('proposal_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('proposal_id')->nullable()->constrained('proposals')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->decimal('amount', 15, 2)->default(0);
            $table->enum('status', ['draft', 'active', 'inactive'])->default('draft');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposal_milestones');
    }
};
