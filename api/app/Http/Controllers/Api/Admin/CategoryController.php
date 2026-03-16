<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderCategoryRequest;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Requests\UpdateCategoryStatusRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(
        private readonly CategoryService $categoryService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->paginate([
            'all' => $request->boolean('all'),
            'parent_id' => $request->input('parent_id'),
            'type' => $request->input('type'),
            'search' => $request->input('search'),
            'per_page' => $request->integer('per_page', 15),
        ]);
        $categories->setCollection(CategoryResource::collection($categories->getCollection())->collection);

        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => CategoryResource::make($category),
        ], 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'data' => CategoryResource::make($this->categoryService->refreshCategory($category)),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $category = $this->categoryService->update($category, $request->validated());

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => CategoryResource::make($category),
        ]);
    }

    public function status(UpdateCategoryStatusRequest $request, Category $category): JsonResponse
    {
        $category = $this->categoryService->setStatus($category, $request->boolean('is_active'));

        return response()->json([
            'message' => 'Category status updated successfully.',
            'data' => CategoryResource::make($category),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $affected = $this->categoryService->delete($category);

        return response()->json([
            'message' => 'Category deleted successfully.',
            'affected_count' => $affected,
        ]);
    }

    public function order(OrderCategoryRequest $request, Category $category): JsonResponse
    {
        $category = $this->categoryService->reorder($category, $request->input('direction'));

        return response()->json([
            'message' => 'Category reordered successfully.',
            'data' => CategoryResource::make($category),
        ]);
    }
}
