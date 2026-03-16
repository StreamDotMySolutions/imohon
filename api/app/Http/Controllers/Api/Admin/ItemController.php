<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ItemResource;
use App\Models\Item;
use App\Services\ItemService;
use App\Enums\ItemStatus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    public function __construct(
        private readonly ItemService $itemService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->itemService->paginate([
            'status' => $request->input('status'),
            'category_id' => $request->input('category_id'),
            'vendor_id' => $request->input('vendor_id'),
            'search' => $request->input('search'),
            'per_page' => $request->integer('per_page', 15),
        ]);
        $items->setCollection(ItemResource::collection($items->getCollection())->collection);

        return response()->json($items);
    }

    public function updateStatus(Request $request, Item $item): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', Rule::enum(ItemStatus::class)],
            'notes' => ['nullable', 'string'],
        ]);

        $item = $this->itemService->updateStatus($item, $data);

        return response()->json([
            'message' => 'Item status updated.',
            'data' => ItemResource::make($item),
        ]);
    }
}
