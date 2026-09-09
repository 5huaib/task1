<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recharge;
use Illuminate\Http\Request;

class RechargeController extends Controller
{
    public function index(Request $request)
    {
        $query = Recharge::query();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('operator')) {
            $query->where('operator', $request->operator);
        }

        if ($request->filled('retailer_id')) {
            $query->where('retailer_id', $request->retailer_id);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        return response()->json($query->latest()->paginate(10));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'retailer_id' => 'required|integer',
            'mobile_number' => 'required|string|digits:10',
            'operator' => 'required|string|in:Airtel,Jio,Vi,BSNL',
            'amount' => 'required|numeric|min:1',
        ]);

        $recharge = Recharge::create(array_merge($validated, ['status' => 'success']));

        return response()->json($recharge, 201);
    }
}