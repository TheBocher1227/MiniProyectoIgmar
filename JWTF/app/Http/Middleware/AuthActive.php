<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PHPOpenSourceSaver\JWTAuth\Contracts\Providers\Auth as ProvidersAuth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\JWT;

class AuthActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     * 
     */
    public function handle(Request $request, Closure $next)
    {
        $user = User::where('email', $request->email)
            ->where('is_active', true)
            ->first();
       // $user = JWTAuth::user();
        /* if()
        {
            return $next($request);
        } */
        //$user=$request->user();
        //$auth;
        //NO JALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
        //YA JALOOOOOOOO😭😭
        
        if ($user) {
            return $next($request);
        }
        return response()->json(["msg"=>"Cuenta no activa"],403);
       
    }
}
