<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Category::query()
            ->withDepth()
            ->defaultOrder()
            ->with('parent')
            ->withCount(['children', 'descendants']);

        if (! ($filters['all'] ?? false)) {
            if (! empty($filters['parent_id'])) {
                $query->where('parent_id', $filters['parent_id']);
            } else {
                $query->whereNull('parent_id');
            }
        }

        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);

            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%')
                    ->orWhere('type', 'like', '%' . $search . '%')
                    ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        return $query->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): Category
    {
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

        return $this->refreshCategory($category);
    }

    public function update(Category $category, array $data): Category
    {
        $category->fill(Arr::only($data, [
            'type',
            'name',
            'slug',
            'description',
            'is_active',
        ]));

        $parentId = $data['parent_id'] ?? null;

        if ($parentId) {
            $parent = Category::find($parentId);

            if ($parent) {
                $category->appendToNode($parent);
            }
        } else {
            $category->saveAsRoot();
        }

        $category->save();

        return $this->refreshCategory($category);
    }

    public function delete(Category $category): int
    {
        $affected = $category->getDescendantCount() + 1;

        DB::transaction(function () use ($category): void {
            $category->delete();
        });

        return $affected;
    }

    public function reorder(Category $category, string $direction): Category
    {
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
            throw new HttpResponseException(response()->json([
                'message' => 'Category is already at the ' . ($direction === 'up' ? 'top' : 'bottom') . ' of its level.',
            ], 422));
        }

        DB::transaction(function () use ($direction, $category, $neighbor): void {
            if ($direction === 'up') {
                $category->beforeNode($neighbor);
            } else {
                $category->afterNode($neighbor);
            }

            $category->save();
        });

        return $this->refreshCategory($category);
    }

    public function refreshCategory(Category $category): Category
    {
        return Category::query()
            ->withDepth()
            ->with('parent')
            ->withCount(['children', 'descendants'])
            ->findOrFail($category->id);
    }
}
