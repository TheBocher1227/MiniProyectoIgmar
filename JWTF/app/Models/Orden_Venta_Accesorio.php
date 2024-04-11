<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orden_Venta_Accesorio extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'orden_venta_accesorios';
    protected $fillable=['orden_venta','accesorio','cantidad'];

    public function id_accesorio()
    {
        return $this->belongsTo(Accesorio::class, );
    }

    public function id_orden()
    {
        return $this->belongsTo(Orden_Venta::class, );
    }
}
