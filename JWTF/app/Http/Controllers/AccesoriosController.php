<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Accesorio;
use Illuminate\Support\Facades\Validator;

class AccesoriosController extends Controller
{
    public function store(Request $request)
    {
      $validate = Validator::make(
        $request->all(),[
            "nombre"=>"required",
            "descripcion"=>"required",
            "precio"=>"required|min:1|max:3",
            "cantidad"=>"required",
            "categoria"=>"required|exists:categorias,id"
        ]
      );

      if ($validate->fails())
      {
        return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()], 422);
      }
      $accesorio = new Accesorio();
      $accesorio->nombre=$request->nombre;
      $accesorio->descripcion=$request->descripcion;
      $accesorio->precio=$request->precio;
      $accesorio->cantidad=$request->cantidad;
      $accesorio->categoria=$request->categoria;
      $accesorio->save();
      $data = "nombre:" . $request->nombre . " descripcion:" . $request->descripcion . " precio:" . $request->precio . " cantidad:" . $request->cantidad ." categoria:" . $request->cantidad;
      $user_id = Auth::id();
      LogHistoryController::store($request, 'accesorio', $data, $user_id);
      return response()->json(["msg"=>"Accesorio agregado correctamente"],200);
    }

    public function index(Request $request){
      $data=Accesorio::all()->toArray();
      $user_id =Auth::id();
      LogHistoryController::store($request, 'accesorio', $data, $user_id);
      return response()->json(["Msg" => "Accesorios encontrados","data :"=>Accesorio::all()],200);
    }

    public function delete(Request $request,int $id)
    {
        $accesorio= Accesorio::find($id);

        if($accesorio)
        {
          $data = "nombre:" . $request->nombre . " descripcion:" . $request->descripcion . " precio:" . $request->precio . " cantidad:" . $request->cantidad ." categoria:" . $request->cantidad;
          $accesorio->delete();
          $user_id = Auth::id();
          LogHistoryController::store($request, 'accesorio', $data, $user_id);
          return response()->json(['accesorio eliminado'],200);
        }
  
        return response()->json(['accesorio no encontrado'],404);
    }

    public function update(Request $request, int $id)
    {
      $validate = Validator::make(
        $request->all(),[
            "nombre"=>"required",
            "descripcion"=>"required",
            "precio"=>"required|min:1|max:3",
            "cantidad"=>"required",
            "categoria"=>"required|exists:categorias,id"
        ]
      );
      if($validate->fails())
      {
          return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()],422);
      }

      $accesorio =Accesorio::find($id);
      if ($accesorio)
      {
          $accesorio->nombre=$request->get('nombre',$accesorio->nombre);
          $accesorio->descripcion=$request->get('descripcion',$accesorio->descripcion);
          $accesorio->precio=$request->get('precio',$accesorio->precio);
          $accesorio->cantidad=$request->get('cantidad',$accesorio->cantidad);
          $accesorio->categoria=$request->get('categoria',$accesorio->categoria);

          $accesorio->save();
          $data = "nombre:" . $request->nombre . " descripcion:" . $request->descripcion . " precio:" . $request->precio . " cantidad:" . $request->cantidad ." categoria:" . $request->cantidad;
          $user_id = Auth::id();
          LogHistoryController::store($request, 'accesorio', $data, $user_id);
          return response()->json(["msg"=>"accesorio actualizado","data"=>$accesorio],202);
      }
      return response()->json([
          "msg"   =>"accesorio not found"
      ],404);
    }


    
}
