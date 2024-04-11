<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    use HasFactory;
    protected $table = 'reportes';
    public $timestamps = false;
    protected $fillable=['precio','fecha_entrega','ingreso'];


}
