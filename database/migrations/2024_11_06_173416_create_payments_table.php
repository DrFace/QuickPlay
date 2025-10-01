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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->enum('type', ['credit', 'debit'])->default('debit');
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('currency')->default('usd');
            $table->enum('status', ['pending', 'succeeded', 'refunded', 'failed'])->default('pending');
            $table->string('payment_for')->nullable();
            $table->foreignUuid('offer_id')->nullable()->constrained('offers')->onDelete('cascade');
            $table->foreignId('offer_milestone_id')->nullable()->constrained('offer_milestones')->onDelete('cascade');
            $table->foreignId('credit_id')->nullable()->constrained('credits')->onDelete('cascade');
            $table->string('stripe_customer_id')->nullable();
            $table->string('stripe_charge_id')->nullable();
            $table->string('stripe_payment_method_id')->nullable();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->string('description')->nullable();
            $table->string('receipt_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
