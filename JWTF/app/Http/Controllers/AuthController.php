<?php

namespace App\Http\Controllers;


use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use App\Models\User;

use Illuminate\Support\Facades\Hash;
use App\Mail\ValidatorEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use App\Mail\CodeEmail;
use Illuminate\Support\Facades\Random;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api',['except' => ['login','register','activate']]);
       
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $this->generatecodigo();
       

        return $this->respondWithToken($token);
    }



    public function generatecodigo()
    {

     $uniquecode= str::random(6);
     $hashedCode=Hash::make($uniquecode);
     auth()->user()->update(['verificacion' => $hashedCode]);
     Mail::to(auth()->user()->email)->send(new CodeEmail($uniquecode));
    

     return response()->json(['Codigo de verificacion  enviado a tu correo ']);

    }

    public function verificarCodigo(Request $request)
    {
    $request->validate([
        'verificacion' => 'required|string|min:6|max:255', 
    ]);

    $user = auth()->user();

    if (!$user) {
        return response()->json(['error' => 'Autenticación requerida'], 401);
    }

    if (Hash::check($request->verificacion, $user->verificacion)) {
        return response()->json(['message' => 'Token de verificación válido'], 200);
    } else {
        return response()->json(['error' => 'Token de verificación inválido'], 401);
    }
    }


    public function verify(Request $request)
    {
        
        try {
            return response()->json([
                "isActive" => true,
                "tipo usuario" => auth()->user()->rol_id
            ]);             
        
        } catch (\Exception $e) {
            return response()->json(["isActive"=>false], 422);
        }

    }




    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(["user"=>auth()->user(),"checando avr si es asi"=> auth()->user()->role_id]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out'],201);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL(60)
        ]);
    }


    public function register(Request $request)
    {
        $validate = Validator::make(
            $request->all(),[
                "name"=>"required|max:30",
                "email"=>"required|unique:users|email",
                "password"=>"required|min:8|string",
                "verificacion"=>"sometimes"
            ]
            );

            if($validate->fails())
            {
                return response()->json(["msg"=>"Datos incorrectos","data"=>$validate->errors()],422);
            }
            
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            
            $user->password = Hash::make($request->password);
            $user->save();
            $signedroute = URL::temporarySignedRoute(
                'activate',
                now()->addMinutes(10),
                ['user' => $user->id]
            );

            $data=$user->toArray();
            $user_id = Auth::id();
            LogHistoryController::store($request, 'user', $data, $user_id);
            Mail::to($request->email)->send(new ValidatorEmail($signedroute));
            return response()->json(["msg"=>"Se mando un mensaje a tu correo","data"=>$user],201);
    }

    public function activate(User $user)
    {
        $user->is_active=true;
        $user->save();
        
      
    }

}