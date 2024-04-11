<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparacion_Dispositivo extends Model
{
    use HasFactory;
   
    public $timestamps = false;
    protected $table = 'reparacion_dispositivos';
    protected $fillable=['dispositivo_id','reparaciones_id','precio'];

    public function dispositivo()
    {
        return $this->belongsTo(Dispositivo::class);
    }

    public function reparacion()
    {
        return $this->belongsTo(Reparacion::class);
    }
}


