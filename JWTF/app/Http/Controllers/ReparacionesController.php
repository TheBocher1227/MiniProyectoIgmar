<?php

namespace App\Http\Controllers;

use App\Events\NuevaReparacion;
use App\Models\Reparacion;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReparacionesController extends Controller
{
    public function index(Request $request)
    {
      $data=Reparacion::all()->toArray();
      $user_id =Auth::id();
      LogHistoryController::store($request, 'reparacion', $data, $user_id);
        return response()->json(["msg"=>"Reparaciones encontradas","data :" => Reparacion::all()],200);
    }

    public function store(Request $request)
    {
      $validate = Validator::make(
        $request->all(),[
        "tipo_reparaciones" => "required"
    ]);

    if ($validate->fails())
    {
        return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()], 422);
    }


    $reparaciones = new Reparacion();
    $reparaciones->tipo_reparaciones=$request->tipo_reparaciones;
    $reparaciones->save();
    event(New NuevaReparacion($reparaciones));
    $data = " tipo_reparaciones: "  . $request->tipo_reparaciones ;
    $user_id = Auth::id();
    LogHistoryController::store($request, 'tiporeparacion', $data, $user_id);
    return response()->json(["Reparacion agregada correctamente "],200);
    }


    public function update(Request $request , int $id)
    {
        $validate = Validator::make(
            $request->all(),[
                "tipo_reparaciones"=>"required"
            ]
          );
    
          if ($validate->fails())
          {
            return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()], 422);
          }
    
          $reparacion = Reparacion::find($id);
          if($reparacion)
          {
            $reparacion->tipo_reparaciones=$request->get('tipo_reparaciones',$reparacion->tipo_reparaciones);
            $reparacion->save();
            event(New NuevaReparacion($reparacion));
            $data = " tipo_reparaciones: "  . $request->tipo_reparaciones ;
            $user_id = Auth::id();
            LogHistoryController::store($request, 'tiporeparacion', $data, $user_id);
            return response()->json(["msg"=>"reparacion actualizada","data"=>$reparacion,],202);
          }
          return response()->json([
            "msg"   =>"reparacion not found"
        ],404);
    
    }


    public function delete(Request $request,int $id)
    {
        $reparacion = Reparacion::find($id);

        if($reparacion)
        {
          $data = " tipo_reparaciones: "  . $request->tipo_reparaciones ;
          event(New NuevaReparacion($reparacion));
          $reparacion->delete();
          
          $user_id = Auth::id();
          LogHistoryController::store($request, 'tiporeparacion', $data, $user_id);
          return response()->json(["reparacion eliminada correctamente"],200);
        }
        
        else{
           return response()->json(["No se encontro la reparacion"],404);
        }
        
    }

}
