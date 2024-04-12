<?php


use App\Mail\ValidatorEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\DispositivosController;
use App\Http\Controllers\ReparacionesController;
use App\Http\Controllers\ReparacionDispositivoController;
use App\Http\Controllers\AccesoriosController;
use App\Http\Controllers\OrdenVentaController;
use App\Http\Controllers\OrdenVentaAccesorioController;
use App\Http\Controllers\CitasController;
use App\Http\Controllers\IngresoReparacionesController;
use App\Http\Controllers\LogHistoryController;
use App\Http\Controllers\ReportesController;


Route::group([

    'middleware' => 'api',
    'prefix' => 'auth'

], function ($router) {

    Route::post('login', [AuthController::class,'login'])->middleware('auth.active');
    Route::post('logout', 'App\Http\Controllers\AuthController@logout');
    Route::post('refresh', 'App\Http\Controllers\AuthController@refresh');
    Route::post('me', 'App\Http\Controllers\AuthController@me');
    Route::post('register', 'App\Http\Controllers\AuthController@register');
    Route::get('activate/{user}', 'App\Http\Controllers\AuthController@activate')->name('activate')->middleware('signed');
    Route::post('verify', [AuthController::class,'verify']);
    Route::post('verificar', [AuthController::class,'verificarcodigo']);

    Route::get('get',[UserController::class,'index']);
    Route::post('post',[UserController::class,'store'])->middleware('authrole2');
    Route::delete('delete/{id}',[UserController::class,'destroy'])->middleware('authrole')->where('id','[0-9]+');
    Route::put('put/{id}',[UserController::class,'update'])->middleware('authrole2')->where('id','[0-9]+');



    Route::post('storecategoria',[CategoriasController::class,'store']);
    Route::put('editarcategoria/{id}',[CategoriasController::class,'update'])->where('id','[0-9]+');
    Route::delete('eliminarcategoria/{id}',[CategoriasController::class,'delete'])->where('id','[0-9]+');
    Route::get('obtenercategoria',[CategoriasController::class,'index']);


    Route::post('storereparacion',[ReparacionesController::class,'store']);
    Route::put('editarreparacion/{id}',[ReparacionesController::class,'update'])->where('id','[0-9]+');
    Route::delete('eliminarreparacion/{id}',[ReparacionesController::class,'delete'])->where('id','[0-9]+');
    Route::get('obtenerreparacion',[ReparacionesController::class,'index']);

    Route::post('storedispositivo',[DispositivosController::class,'store']);
    Route::put('editardispositivo/{id}',[DispositivosController::class,'update'])->where('id','[0-9]+');
    Route::delete('eliminardispositivo/{id}',[DispositivosController::class,'delete'])->where('id','[0-9]+');
    Route::get('obtenerdispositivo',[DispositivosController::class,'index']);

    Route::post('storereparaciondispositivo',[ReparacionDispositivoController::class,'store']);
    Route::put('editarreparaciondispositivo/{id}',[ReparacionDispositivoController::class,'update']);
    Route::delete('eliminarreparaciondispositivo/{id}',[ReparacionDispositivoController::class,'delete']);
    Route::get('obtenerreparaciondispositivo',[ReparacionDispositivoController::class,'index']);

    Route::post('storeaccesorio',[AccesoriosController::class,'store']);
    Route::put('editaraccesorio/{id}',[AccesoriosController::class,'update']);
    Route::delete('eliminaraccesorio/{id}',[AccesoriosController::class,'delete']);
    Route::get('obteneraccesorio',[AccesoriosController::class,'index']);


    Route::post('storeordenventa',[OrdenVentaController::class,'store']);
    Route::put('editarordenventa/{id}',[OrdenVentaController::class,'update']);
    Route::delete('eliminarordenventa/{id}',[OrdenVentaController::class,'delete']);
    Route::get('obtenerordenventa',[OrdenVentaController::class,'index']);


    Route::post('storeordenventaA',[OrdenVentaAccesorioController::class,'store']);
    Route::put('editarordenventaA/{id}',[OrdenVentaAccesorioController::class,'update']);
    Route::delete('eliminarordenventaA/{id}',[OrdenVentaAccesorioController::class,'delete']);
    Route::get('obtenerordenventaA',[OrdenVentaAccesorioController::class,'index']);


    
    Route::post('storecita',[CitasController::class,'store']);
    Route::put('editarcita/{id}',[CitasController::class,'update']);
    Route::delete('eliminarcita/{id}',[CitasController::class,'delete']);
    Route::get('obtenercita',[CitasController::class,'index']);

    
    Route::post('storeingreso',[IngresoReparacionesController::class,'store']);
    Route::put('editaringreso/{id}',[IngresoReparacionesController::class,'update']);
    Route::delete('eliminaringreso/{id}',[IngresoReparacionesController::class,'delete']);
    Route::get('obteneringreso',[IngresoReparacionesController::class,'index']);

    Route::post('storereporte',[ReportesController::class,'store']);
    Route::put('editarreporte/{id}',[ReportesController::class,'update']);
    Route::delete('eliminarreporte/{id}',[ReportesController::class,'delete']);
    Route::get('obtenerreporte',[ReportesController::class,'index']);


    Route::get('logs',[LogHistoryController::class,'index']);
    
});

Route::get('sse',[CategoriasController::class,'sendSSE']);



