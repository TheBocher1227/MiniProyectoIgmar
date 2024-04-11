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
        Schema::create('reparacion_dispositivos',function (Blueprint $table){
        $table->id();
        $table->foreignId('dispositivo_id')->constrained()->onDelete('cascade');
        $table->foreignId('reparaciones_id')->constrained()->onDelete('cascade');
        $table->string('precio');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reparacion_dispositivos');
    }
};
