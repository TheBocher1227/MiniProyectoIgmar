<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orden_venta', function(Blueprint $table){
       $table->id();
       $table->date('fecha_orden');
       $table->String('estado');
       $table->foreignId('user')->constrained()->onDelete('cascade');
       $table->String('tipo_venta');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orden_venta');
    }
};
