<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orden_Venta extends Model
{
    use HasFactory;
    protected $table = 'orden_venta';
    public $timestamps = false;

    protected $fillable =['fecha_orden','estado','user','tipo_venta'];

    public function cliente_orden()
    {
        return $this->belongsTo(User::class);
    }
    
    public function orden_venta_accesorio()
    {
        return $this->hasMany(Orden_Venta_Accesorio::class);
    }


    
}
