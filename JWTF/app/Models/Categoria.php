<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable=['tipo_categoria'];

    public function accesorios()
    {
        return $this->hasMany(Accesorio::class);
    }
}
