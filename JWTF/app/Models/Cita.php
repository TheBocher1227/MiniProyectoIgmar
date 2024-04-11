<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;
    public $timestamps = false;

    protected $fillable=['fecha_cita','motivo_cita','estado_cita','dispositivo','usuario','hora_cita'];

    public function usuario()
    {
     return $this->belongsTo(User::class);
    }


    public function dispositivo()
    {
        return $this->belongsTo(Dispositivo::class);
    }
}
