<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Orden_Venta_Accesorio;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class OrdenVentaAccesorioController extends Controller
{
    
    public function store(Request $request)
    {
      $validate = Validator::make(
        $request->all(),[
            "orden_venta"=>"required|exists:orden_venta,id",
            "accesorio"=>"required|exists:accesorios,id",
            "cantidad"=>"required",
        ]
      );

      if ($validate->fails())
      {
        return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()], 422);
      }


      $ordenventa = new Orden_Venta_Accesorio();
      $ordenventa->orden_venta=$request->orden_venta;
      $ordenventa->accesorio=$request->accesorio;
      $ordenventa->cantidad=$request->cantidad;
      
      
      $ordenventa->save();
      $data = " orden_venta: "  . $request->orden_venta . " accesorio: " . $request->accesorio . " cantidad: " . $request->cantidad ;
      $user_id = Auth::id();
      LogHistoryController::store($request, 'ordenventaaccesorio', $data, $user_id);
      return response()->json(["msg"=>"orden_venta_accesorio agregada correctamente"],200);
    }

    public function index(Request $request){
      $data=Orden_Venta_Accesorio::all()->toArray();
      $user_id =Auth::id();
      LogHistoryController::store($request, 'ordenventaaccesorio', $data, $user_id);
      return response()->json(["Msg" => "orden_venta_accesorios encontrados","data :"=>Orden_Venta_Accesorio::all()],200);
    }

    public function delete(Request $request,int $id)
    {
        $ordenventa= Orden_Venta_Accesorio::find($id);

        if($ordenventa)
        {
          $data = " orden_venta: "  . $request->orden_venta . " accesorio: " . $request->accesorio . " cantidad: " . $request->cantidad ;
            $ordenventa->delete();
            $user_id = Auth::id();
            LogHistoryController::store($request, 'ordenventaaccesorio', $data, $user_id);
          return response()->json(['orden_venta_accesorio eliminada'],200);
        }
  
        return response()->json(['orden_venta_accesorio no encontrada'],404);
    }

    public function update(Request $request, int $id)
    {
        $validate = Validator::make(
            $request->all(),[
                "orden_venta"=>"required|exists:orden_venta,id",
                "accesorio"=>"required|exists:accesorios,id",
                "cantidad"=>"required",
                
            ]
          );
      if($validate->fails())
      {
          return response()->json(["msg"=>"data failed", "data : "=>$validate->errors()],422);
      }

      $ordenventa =Orden_Venta_Accesorio::find($id);
      if ( $ordenventa)
      {
        $ordenventa->orden_venta=$request->get('orden_venta', $ordenventa->orden_venta);
        $ordenventa->accesorio=$request->get('accesorio', $ordenventa->accesorio);
        $ordenventa->cantidad=$request->get('cantidad', $ordenventa->cantidad);
       

        $ordenventa->save();
        $data = " orden_venta: "  . $request->orden_venta . " accesorio: " . $request->accesorio . " cantidad: " . $request->cantidad ;
        $user_id = Auth::id();
        LogHistoryController::store($request, 'ordenventaaccesorio', $data, $user_id);
          return response()->json(["msg"=>"orden_venta_accesorio actualizada","data"=> $ordenventa],202);
      }
      return response()->json([
          "msg"   =>"orden_venta_accesorio not found"
      ],404);
    }
}
