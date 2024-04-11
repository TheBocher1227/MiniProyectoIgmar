<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Reparacion_Dispositivo;


class ReparacionDispositivoController extends Controller
{
    public function index(Request $request)
    {
        $data=Reparacion_Dispositivo::all()->toArray();
        $user_id =Auth::id();
        LogHistoryController::store($request, 'reparaciondispositivo', $data, $user_id);
        return response()->json(["Msg" => "ReparacionDispositivos encontrados","data :"=>Reparacion_Dispositivo::all()],200);
    }

    public function store(Request $request)
    {
      $validate = Validator::make(
        $request->all(),[
            'dispositivo_id'=> 'required|exists:dispositivos,id',
            'reparaciones_id'=> 'required|exists:reparaciones,id',
            'precio' => 'required|min:1|max:3',
        ]
      );

      if ($validate->fails())
      {
        return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()],422);
      }

      $reparacion = new Reparacion_Dispositivo();
        $reparacion->dispositivo_id=$request->dispositivo_id;
        $reparacion->reparaciones_id=$request->reparaciones_id;
        $reparacion->precio=$request->precio;
        $reparacion->save();
        $data = " dispositivo_id: "  . $request->dispositivo_id . " reparaciones_id: " . $request->reparaciones_id . " precio: " . $request->precio ;
        $user_id = Auth::id();
        LogHistoryController::store($request, 'reparacionDispositivo', $data, $user_id);
        return response()->json(["Reparacion agregada"],200);

    }

    public function delete(Request $request,int $id)
    {
        $reparaciondispositivo= Reparacion_Dispositivo::find($id);

        if($reparaciondispositivo)
        {
          $data = " dispositivo_id: "  . $request->dispositivo_id . " reparaciones_id: " . $request->reparaciones_id . " precio: " . $request->precio ;
          $reparaciondispositivo->delete();
          $user_id = Auth::id();
            LogHistoryController::store($request, 'reparacionDispositivo', $data, $user_id);
          return response()->json(['reparacion_dispositivo eliminado'],200);
        }
  
        return response()->json(['reparacion_dispositivo no encontrado'],404);
    }



    public function update(Request $request , int $id)
    {
        $validate = Validator::make(
            $request->all(),[
                'dispositivo_id'=> 'required|exists:dispositivos,id',
                'reparaciones_id'=> 'required|exists:reparaciones,id',
                'precio' => 'required|min:1|max:3',
            ]
          );
    
    
         if($validate->fails())
            {
                return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()],422);
            }
    
    
            $reparacion = Reparacion_Dispositivo::find($id);
    
            if ($reparacion)
            {
                $reparacion->dispositivo_id=$request->get('dispositivo_id',$reparacion->dispositivo_id);
                $reparacion->reparaciones_id=$request->get('reparaciones_id',$reparacion->reparaciones_id);
                $reparacion->precio=$request->get('precio',$reparacion->precio);
                $reparacion->save();

                $data = " dispositivo_id: "  . $request->dispositivo_id . " reparaciones_id: " . $request->reparaciones_id . " precio: " . $request->precio ;
                $user_id = Auth::id();
                LogHistoryController::store($request, 'reparacionDispositivo', $data, $user_id);
                return response()->json(["msg"=>"reparacion_dispositivo actualizada","data"=>$reparacion],202);
            }
            return response()->json([
                "msg"   =>"reparacion_dispositivo not found"
            ],404);
    
    }
}
