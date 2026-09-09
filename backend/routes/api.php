<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RechargeController;

Route::get('/recharges', [RechargeController::class, 'index']);
Route::post('/recharges', [RechargeController::class, 'store']);