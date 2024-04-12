<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run()
    {
        DB::table('users')->insert([
            'name' => 'Nombre de Usuario',
            'email' => 'usuario@example.com',
            'rol_id' => 1, 
            'is_active' => true,
            'password' => bcrypt('contraseña'),
            'verificacion' => '123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}