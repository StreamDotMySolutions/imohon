<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContractRequest;
use App\Http\Requests\UpdateContractRequest;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use App\Services\ContractService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function __construct(
        private readonly ContractService $contractService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $contracts = $this->contractService->paginate([
            'search' => $request->input('search'),
            'vendor_id' => $request->input('vendor_id'),
            'category_id' => $request->input('category_id'),
            'active' => $request->input('active'),
            'per_page' => $request->integer('per_page', 15),
        ]);
        $contracts->setCollection(ContractResource::collection($contracts->getCollection())->collection);

        return response()->json($contracts);
    }

    public function store(StoreContractRequest $request): JsonResponse
    {
        $contract = $this->contractService->create($request->validated());

        return response()->json([
            'message' => 'Contract created successfully.',
            'data' => ContractResource::make($contract),
        ], 201);
    }

    public function show(Contract $contract): JsonResponse
    {
        return response()->json([
            'data' => ContractResource::make($this->contractService->refreshContract($contract)),
        ]);
    }

    public function update(UpdateContractRequest $request, Contract $contract): JsonResponse
    {
        $contract = $this->contractService->update($contract, $request->validated());

        return response()->json([
            'message' => 'Contract updated successfully.',
            'data' => ContractResource::make($contract),
        ]);
    }

    public function destroy(Contract $contract): JsonResponse
    {
        $this->contractService->delete($contract);

        return response()->json([
            'message' => 'Contract deleted successfully.',
        ]);
    }

    public function toggleStatus(Request $request, Contract $contract): JsonResponse
    {
        $contract = $this->contractService->toggleStatus($contract, (bool) $request->input('active'));

        return response()->json([
            'message' => 'Contract status updated.',
            'data' => ContractResource::make($contract),
        ]);
    }
}
