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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->unique();
            $table->foreignId('vendor_id')->nullable()->constrained()->nullOnDelete();
            $table->string('vendor_name')->nullable();
            $table->foreignId('category_id')->constrained('categories');
            $table->integer('total')->default(0);
            $table->date('date_start');
            $table->date('date_end');
            $table->date('date_delivery')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
