<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Jenssegers\Mongodb\Eloquent\Model;

class LogHistory extends Model
{
    use HasFactory;
    protected $connection = 'mongodb';
    protected $collection = 'log_history';

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
