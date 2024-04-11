<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

use App\Models\Cita;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class CitasController extends Controller
{
    
    public function store(Request $request)
    {
      $validate = Validator::make(
        $request->all(),[
            "fecha_cita"=>"required",
            "motivo_cita"=>"required|min:1",
            "estado_cita"=>"required|min:1",
            "dispositivo"=>"required|exists:dispositivos,id",
            "usuario"=>"required|exists:users,id",
            "hora_cita"=>"required",

            
        ]
      );

      if ($validate->fails())
      {
        return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()], 422);
      }


      $cita = new Cita();
      $cita->fecha_cita=$request->fecha_cita;
      $cita->motivo_cita=$request->motivo_cita;
      $cita->estado_cita=$request->estado_cita;
      $cita->dispositivo=$request->dispositivo;
      $cita->usuario=$request->usuario;
      $cita->hora_cita=$request->hora_cita;
      $cita->save();
      $data = " fecha_cita: "  . $request->fecha_cita . " motivo_cita: " . $request->motivo_cita . " estado_cita: " . $request->estado_cita . " dispositivo: " . $request->dispositivo ." usuario: " . $request->usuario . "hora_cita: " . $request->hora_cita;
      $user_id = Auth::id();
      LogHistoryController::store($request, 'Cita', $data, $user_id);
      return response()->json(["msg"=>"cita agregada correctamente"],200);
    }

    public function index(Request $request){
      $data=Categoria::all()->toArray();
      $user_id =Auth::id();
      LogHistoryController::store($request, 'categoria', $data, $user_id);
      return response()->json(["Msg" => "citas encontradas","data :"=>Cita::all()],200);
    }

    public function delete(Request $request,int $id)
    {
        $cita= Cita::find($id);

        if($cita)
        { 
          $data = " fecha_cita: "  . $request->fecha_cita . " motivo_cita: " . $request->motivo_cita . " estado_cita: " . $request->estado_cita . " dispositivo: " . $request->dispositivo ." usuario: " . $request->usuario . "hora_cita: " . $request->hora_cita;
            $cita->delete();
            $user_id = Auth::id();
            LogHistoryController::store($request, 'Cita', $data, $user_id);
          return response()->json(['cita eliminada'],200);
        }
  
        return response()->json(['cita no encontrada'],404);
    }

    public function update(Request $request, int $id)
    {
      $validate = Validator::make(
        $request->all(),[
            "fecha_cita"=>"required",
            "motivo_cita"=>"required|min:1",
            "estado_cita"=>"required|min:1",
            "dispositivo"=>"required|exists:dispositivos,id",
            "usuario"=>"required|exists:users,id",
            "hora_cita"=>"required",

            
        ]
      );
      if($validate->fails())
      {
          return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()],422);
      }

      $cita =Cita::find($id);
      if ( $cita)
      {
       
        $cita->fecha_cita=$request->get('fecha_cita', $cita->fecha_cita);
        $cita->motivo_cita=$request->get('motivo_cita', $cita->motivo_cita);
        $cita->estado_cita=$request->get('estado_cita', $cita->estado_cita);
        $cita->dispositivo=$request->get('dispositivo', $cita->dispositivo);
        $cita->usuario=$request->get('usuario', $cita->usuario);
        $cita->hora_cita=$request->get('hora_cita', $cita->hora_cita);
        $cita->save();
        $data = " fecha_cita: "  . $request->fecha_cita . " motivo_cita: " . $request->motivo_cita . " estado_cita: " . $request->estado_cita . " dispositivo: " . $request->dispositivo ." usuario: " . $request->usuario . "hora_cita: " . $request->hora_cita;
        $user_id = Auth::id();
        LogHistoryController::store($request, 'Cita', $data, $user_id);
          return response()->json(["msg"=>"cita actualizada","data"=> $cita],202);
      }
      return response()->json([
          "msg"   =>"cita not found"
      ],404);
    }
}
