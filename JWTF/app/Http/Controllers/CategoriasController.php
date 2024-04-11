<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Categoria;

use Illuminate\Support\Facades\Validator;

class CategoriasController extends Controller
{
    public function index(Request $request)
    {

      $data = Categoria::all()->toArray();
      $user_id = Auth::id();
      LogHistoryController::store($request, 'categoria', $data, $user_id);
        return response()->json(["msg"=>"categorias encontradas",
        "data :"=>Categoria::all()],200);
    }



    public function store(Request $request)
    {
        $validate = Validator::make(
            $request->all(),
            [
                "tipo_categoria" => "required"
            ]
        );
    
        if ($validate->fails()) {
            return response()->json(["msg" => "data failed", "data" => $validate->errors()], 422);
        }
    
        $categoria = new Categoria();
        $categoria->tipo_categoria = $request->tipo_categoria;
        $categoria->save();
        

        $logData = "Tipo de categoría: " . $request->tipo_categoria  ;
       
        $user_id = Auth::id();
        
        
        LogHistoryController::store($request, 'categoria', $logData, $user_id);
    
        return response()->json(["msg" => "Categoria agregada correctamente"], 200);
    }
    


    public function update(Request $request,int $id)
    {
      $validate = Validator::make(
        $request->all(),[
            "tipo_categoria"=>"required"
        ]
      );

      if ($validate->fails())
      {
        return response()->json(["msg"=>"data failed", "data"=>$validate->errors()], 422);
      }

      $categoria = Categoria::find($id);
      if($categoria)
      {
        $categoria->tipo_categoria=$request->get('tipo_categoria',$categoria->tipo_categoria);
        $categoria->save();
        $data = "Tipo de categoría: " . $request->tipo_categoria;
        $user_id = Auth::id();
        LogHistoryController::store($request, 'categoria', $data, $user_id);
        return response()->json(["msg"=>"categoria actualizada","data"=>$categoria,],202);
      }
      return response()->json([
        "msg"   =>"categoria not found"
    ],404);


    }



    public function delete(Request $request,int $id)
    {
        $categoria = Categoria::find($id);

        if($categoria)
        {
          $data = "Tipo de categoria:" . $request->tipo_categoria;

          $categoria->delete();
          $user_id = Auth::id();
          LogHistoryController::store($request, 'categoria', $data, $user_id);
          return response()->json(["msg"=>"Categoria eliminada correctamente","data"=>$categoria],200);
        }
        return response()->json(["msg"=>"No se encontro la categoria"],404);
    }
    
   


}
