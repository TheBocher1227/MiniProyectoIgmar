<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use App\Models\Dispositivo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class DispositivosController extends Controller
{
    public function index(Request $request)
    {
        $data=Dispositivo::all()->toArray();
      $user_id =Auth::id();
      LogHistoryController::store($request, 'dispositivo', $data, $user_id);
        return response()->json(["Msg" => "Dispositivos encontrados","data :"=>Dispositivo::all()],200);
    }

    public function store(Request $request)
    {
        $validate = Validator::make(
            $request->all(),[
                "marca" => "required",
                "modelo" =>"required",
                "tipo_dispositivos" => "required",

            ]
        );


        if($validate->fails())
        {
            return response()->json(["msg"=>"data failed", "data"=>$validate->errors()],422);
        }


        $dispositivo = new Dispositivo();
        $dispositivo->marca=$request->marca;
        $dispositivo->modelo=$request->modelo;
        $dispositivo->tipo_dispositivos=$request->tipo_dispositivos;
        $dispositivo->save();

        $data = " marca: "  . $request->marca . " modelo: " . $request->modelo . " tipo_dispositivos: " . $request->tipo_dispositivos ;
        $user_id = Auth::id();
        LogHistoryController::store($request, 'dispositivo', $data, $user_id);
        return response()->json(["msg"=>"Dispositivo agregado correctamente"],200);
    }


    public function update(Request $request , int $id)
    {
     $validate = Validator::make(
        $request->all(),[
            "marca"=>"required|min:1",
            "modelo"=>"required|min:1",
            "tipo_dispositivos"=>"required"
        ]
     );


     if($validate->fails())
        {
            return response()->json(["msg"=>"data failed", "data"=>$validate->errors()],422);
        }


        $dispositivo = Dispositivo::find($id);

        if ($dispositivo)
        {
            $dispositivo->marca=$request->get('marca',$dispositivo->marca);
            $dispositivo->modelo=$request->get('modelo',$dispositivo->marca);
            $dispositivo->tipo_dispositivos=$request->get('tipo_dispositivos',$dispositivo->tipo_dispositivos);
            $dispositivo->save();
            $data = " marca: "  . $request->marca . " modelo: " . $request->modelo . " tipo_dispositivos: " . $request->tipo_dispositivos ;
            $user_id = Auth::id();
            LogHistoryController::store($request, 'dispositivo', $data, $user_id);
            return response()->json(["msg"=>"categoria actualizada","data"=>$dispositivo],202);
        }
        return response()->json([
            "msg"   =>"dispositivo not found"
        ],404);


    }



    public function delete(Request $request,int $id)
    {
      $dispositivo = Dispositivo::find($id);

      if($dispositivo)
      {
        $data = " marca: "  . $request->marca . " modelo: " . $request->modelo . " tipo_dispositivos: " . $request->tipo_dispositivos ;
        $dispositivo->delete();
        $user_id = Auth::id();
        LogHistoryController::store($request, 'dispositivo', $data, $user_id);
        return response()->json(["msg"=>'Dispositivo eliminado'],200);
      }

      return response()->json(['Dispositivo no encontrado'],404);

    }
}
