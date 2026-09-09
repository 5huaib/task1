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
    Schema::create('recharges', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('retailer_id')->index();
        $table->string('mobile_number');
        $table->string('operator');
        $table->decimal('amount', 8, 2);
        $table->enum('status', ['success', 'failed', 'pending'])->default('pending')->index();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recharges');
    }
};
