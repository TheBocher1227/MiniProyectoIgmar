<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparacion extends Model
{
    use HasFactory;
    protected $table = 'reparaciones';
    
    public $timestamps = false;
     protected $fillable=['tipo_reparaciones'];


     public function ingreso_reparacion()
     {
        return $this->hasMany(Ingreso_Reparacion::class);
     }
}
