<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\InventoryResource;
use App\Services\InventoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $inventories = $this->inventoryService->paginate([
            'search' => $request->input('search'),
            'vendor_id' => $request->input('vendor_id'),
            'category_id' => $request->input('category_id'),
            'per_page' => $request->integer('per_page', 15),
        ]);
        $inventories->setCollection(InventoryResource::collection($inventories->getCollection())->collection);

        return response()->json($inventories);
    }

    public function summary(): JsonResponse
    {
        return response()->json([
            'data' => $this->inventoryService->summary(),
        ]);
    }
}
