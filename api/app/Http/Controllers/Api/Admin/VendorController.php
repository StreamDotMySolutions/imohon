<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\VendorResource;
use App\Models\Vendor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Vendor::query()->where('active', true);

        if ($request->filled('search')) {
            $search = trim($request->input('search'));
            $query->where('name', 'like', '%' . $search . '%');
        }

        $vendors = $query->orderBy('name')->limit(100)->get();

        return response()->json([
            'data' => VendorResource::collection($vendors),
        ]);
    }
}
