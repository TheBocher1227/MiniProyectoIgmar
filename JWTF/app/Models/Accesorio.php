<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Accesorio extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable=['nombre','descripcion','precio','cantidad','categoria'];

    public function tipo_categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function orden_venta_accesorio()
    {
        return $this->hasMany(Orden_Venta_Accesorio::class);
    }
}
