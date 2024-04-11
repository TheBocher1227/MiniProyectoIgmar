<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispositivo extends Model
{
    use HasFactory;
    protected $table ='dispositivos';
    public $timestamps = false;


    protected $fillable=['marca','modelo','tipo_dispositivos'];

    public function ingreso_reparacion()
     {
        return $this->hasMany(Ingreso_Reparacion::class);
     }


     public function reparacion_dispositivo()
     {
        return $this->hasMany(Reparacion_Dispositivo::class);
     }

     public function dispositivo()
     {
      return $this->hasMany(Dispositivo::class);
     }
}
