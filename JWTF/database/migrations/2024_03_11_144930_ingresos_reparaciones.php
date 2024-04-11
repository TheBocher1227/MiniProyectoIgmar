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
        Schema::create('ingresos_reparaciones',function(Blueprint $table){
       $table->id();
       $table->foreignId('user')->constrained('users')->onDelete('cascade');
       $table->foreignId('dispositivo')->constrained('dispositivos')->onDelete('cascade');
       $table->foreignId('reparacion')->constrained('reparaciones')->onDelete('cascade');
       $table->string('descripcion');
       $table->date('fecha_ingreso');
       $table->string('estatus');
       
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
};
