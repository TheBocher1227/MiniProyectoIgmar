<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orden_Venta;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrdenVentaController extends Controller
{
    public function store(Request $request)
    {
      $validate = Validator::make(
        $request->all(),[
            "fecha_orden"=>"required",
            "estado"=>"required",
            "user"=>"required|exists:users,id",
            "tipo_venta"=>"required",
        ]
      );

      if ($validate->fails())
      {
        return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()], 422);
      }


      $ordenventa = new Orden_Venta();
      $ordenventa->fecha_orden=$request->fecha_orden;
      $ordenventa->estado=$request->estado;
      $ordenventa->user=$request->user;
      $ordenventa->tipo_venta=$request->tipo_venta;
      
      $ordenventa->save();
      $data = " fecha_orden: "  . $request->fecha_orden . " estado: " . $request->estado . " user: " . $request->user . " tipo_venta: " . $request->tipo_venta;
      $user_id = Auth::id();
      LogHistoryController::store($request, 'ordenventa', $data, $user_id);
      return response()->json(["msg"=>"orden:venta agregada correctamente"],200);
    }

    public function index(Request $request){
      $data=Orden_Venta::all()->toArray();
      $user_id =Auth::id();
      LogHistoryController::store($request, 'ordenventa', $data, $user_id);
      return response()->json(["Msg" => "Accesorios encontrados","data :"=>Orden_Venta::all()],200);
    }

    public function delete(Request $request,int $id)
    {
        $ordenventa= Orden_Venta::find($id);

        if($ordenventa)
        {
          $data = " fecha_orden: "  . $request->fecha_orden . " estado: " . $request->estado . " user: " . $request->user . " tipo_venta: " . $request->tipo_venta;
            $ordenventa->delete();
            $user_id = Auth::id();
            LogHistoryController::store($request, 'ordenventa', $data, $user_id);
          return response()->json(['orden_venta eliminada'],200);
        }
  
        return response()->json(['orden_venta no encontrada'],404);
    }

    public function update(Request $request, int $id)
    {
        $validate = Validator::make(
            $request->all(),[
                "fecha_orden"=>"required",
                "estado"=>"required",
                "user"=>"required|exists:users,id",
                "tipo_venta"=>"required",
            ]
          );
      if($validate->fails())
      {
          return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()],422);
      }

      $ordenventa =Orden_Venta::find($id);
      if ( $ordenventa)
      {
        $ordenventa->fecha_orden=$request->get('fecha_orden', $ordenventa->fecha_orden);
        $ordenventa->estado=$request->get('estado', $ordenventa->estado);
        $ordenventa->user=$request->get('user', $ordenventa->user);
        $ordenventa->tipo_venta=$request->get('tipo_venta', $ordenventa->tipo_venta);
        $ordenventa->save();
        $data = " fecha_orden: "  . $request->fecha_orden . " estado: " . $request->estado . " user: " . $request->user . " tipo_venta: " . $request->tipo_venta;
        $user_id = Auth::id();
       LogHistoryController::store($request, 'ordenventa', $data, $user_id);
          return response()->json(["msg"=>"orden_venta actualizada","data"=> $ordenventa],202);
      }
      return response()->json([
          "msg"   =>"accesorio not found"
      ],404);
    }
}
