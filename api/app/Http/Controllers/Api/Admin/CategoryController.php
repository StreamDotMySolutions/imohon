<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderCategoryRequest;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Category::query()->withDepth()->defaultOrder();

        if ($request->boolean('all')) {
            // Return the full tree for UI controls like parent selectors and breadcrumbs.
        } elseif ($request->filled('parent_id')) {
            $query->where('parent_id', $request->input('parent_id'));
        } else {
            $query->whereNull('parent_id');
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->trim()->toString();

            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->orWhere('type', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        $categories = $query->paginate($request->integer('per_page', 15));

        $categories->through(fn (Category $category) => $this->transformCategory($category));

        return response()->json($categories);
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $data = $request->validated();

        $category = new Category([
            'type' => $data['type'],
            'name' => $data['name'],
            'slug' => $data['slug'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        if (! empty($data['parent_id'])) {
            $parent = Category::find($data['parent_id']);
            if ($parent) {
                $category->appendToNode($parent);
            }
        }

        $category->save();

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $this->transformCategory($category->refresh()),
        ], 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'data' => $this->transformCategory($category),
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $data = Arr::only($request->validated(), [
            'type',
            'name',
            'slug',
            'description',
            'is_active',
        ]);

        $category->fill($data);

        $parentId = $request->input('parent_id');

        if ($parentId) {
            $parent = Category::find($parentId);
            if ($parent) {
                $category->appendToNode($parent);
            }
        } else {
            $category->saveAsRoot();
        }

        $category->save();

        return response()->json([
            'message' => 'Category updated successfully.',
            'data' => $this->transformCategory($category->refresh()),
        ]);
    }

    public function destroy(Category $category): JsonResponse
    {
        $affected = $category->getDescendantCount() + 1;

        DB::transaction(function () use ($category): void {
            $category->delete();
        });

        return response()->json([
            'message' => 'Category deleted successfully.',
            'affected_count' => $affected,
        ]);
    }

    public function order(OrderCategoryRequest $request, Category $category): JsonResponse
    {
        $direction = $request->input('direction');
        $moved = false;

        $neighborQuery = Category::query()
            ->where('parent_id', $category->parent_id)
            ->where('id', '!=', $category->id);

        if ($direction === 'up') {
            $neighborQuery->where('_lft', '<', $category->getLft())->orderBy('_lft', 'desc');
        } else {
            $neighborQuery->where('_lft', '>', $category->getLft())->orderBy('_lft', 'asc');
        }

        $neighbor = $neighborQuery->first();

        if (! $neighbor) {
            return response()->json([
                'message' => 'Category is already at the ' . ($direction === 'up' ? 'top' : 'bottom') . ' of its level.',
            ], 422);
        }

        DB::transaction(function () use ($direction, $category, $neighbor): void {
            if ($direction === 'up') {
                $category->beforeNode($neighbor);
            } else {
                $category->afterNode($neighbor);
            }
            $category->save();
        });

        return response()->json([
            'message' => 'Category reordered successfully.',
            'data' => $this->transformCategory($category->fresh()),
        ]);
    }

    private function transformCategory(Category $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'type' => $category->type,
            'description' => $category->description,
            'is_active' => $category->is_active,
            'parent_id' => $category->parent_id,
            'parent_name' => $category->parent?->name,
            'depth' => $category->depth,
            'has_children' => $category->children()->exists(),
            'children_count' => $category->children()->count(),
            'descendants_count' => $category->descendants()->count(),
            'created_at' => $category->created_at?->format('d/m/Y h:i A'),
            'updated_at' => $category->updated_at?->format('d/m/Y h:i A'),
        ];
    }
}
