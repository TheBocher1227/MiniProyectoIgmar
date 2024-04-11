<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use App\Mail\ValidatorEmail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
class UserController extends Controller
{
  
    public function index(Request $request)
    { 
        $data=User::all()->toArray();
        $user_id =Auth::id();
        LogHistoryController::store($request, 'user', $data, $user_id);
       return response()->json(["msg"=>"Users finded",
        "data: "=>User::all(),],200);
    }
    public function store(Request $request)
    {
       
        $validate = Validator::make(
            $request->all(),[
                "name"=>"required|max:30",
                "email"=>"required|unique:users|email",
                "rol_id"=>"numeric|between:1,3",
                "password"=>"required|min:8|string"
            ]
        );

        if($validate->fails())
        {
            return response()->json(["msg"=>"Data failed",
            "data:"=>$validate->errors()],422);
        }

        $user = new User();
        $user->name=$request->name;
        $user->email=$request->email;
        $user->password=Hash::make($request->password);
        $user->rol_id=$request->get('rol_id',3);
        $user->save();
        $signedroute = URL::temporarySignedRoute(
            'activate',
            now()->addMinutes(10),
            ['user' => $user->id]
        );
        Mail::to($request->email)->send(new ValidatorEmail($signedroute));
        $data = " name: "  . $request->name . " email: " . $request->email . " password: " . $request->password . "rol_id: " . $request->rol_id;
      $user_id = Auth::id();
      LogHistoryController::store($request, 'user', $data, $user_id);
        return response()->json(["msg"=>"User created, check your email","data"=>$user,],201);
    }

    public function update(Request $request, int $id)
{
    $validate = Validator::make(
        $request->all(), [
            "name" => "required|max:30",
            // Excluye el ID del usuario actual de la validación unique
            "email" => "required|email|unique:users,email,".$id,
            "rol_id" => "numeric|between:1,3",
            "password" => "min:8|string"
        ]
    );

    if ($validate->fails()) {
        return response()->json(["msg" => "Data failed",
        "data:" => $validate->errors()], 422);
    }
    $user = User::find($id);
    if ($user) {
        $user->name = $request->get('name', $user->name);
        $user->email = $request->get('email', $user->email);
        $user->password = $request->get('password', $user->password);
        $user->rol_id = $request->get('rol_id', $user->rol_id);
        $user->save();
        $data = " name: "  . $request->name . " email: " . $request->email . " password: " . $request->password . "rol_id: " . $request->rol_id;
        $user_id = Auth::id();
        LogHistoryController::store($request, 'user', $data, $user_id);
        return response()->json(["msg" => "User updated", "data" => $user,], 202);
    }
    return response()->json([
        "msg"   => "User not found"
    ], 404);
}

    public function destroy(Request $request,int $id)
    {
        $user=User::find($id);
        if($user){

            $data = " name: "  . $request->name . " email: " . $request->email . " password: " . $request->password . "rol_id: " . $request->rol_id;
            $user->delete();
            $user_id = Auth::id();
            LogHistoryController::store($request, 'user', $data, $user_id);
            return response()->json(["msg"=>"User eliminado","data"=>$user,],202);
        }
        return response()->json([
            "msg"   =>"User not found"
        ],404);
    }

    public function activate(User $user)
    {
        $user->is_active=true;
        $user->save();
        
      
    }
}
