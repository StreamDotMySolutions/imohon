<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $childrenCount = $this->children_count ?? $this->children()->count();
        $descendantsCount = $this->descendants_count ?? $this->descendants()->count();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'type' => $this->type,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'parent_id' => $this->parent_id,
            'parent_name' => $this->parent?->name,
            'depth' => $this->depth,
            'has_children' => $childrenCount > 0,
            'children_count' => $childrenCount,
            'descendants_count' => $descendantsCount,
            'created_at' => $this->created_at?->format('d/m/Y h:i A'),
            'updated_at' => $this->updated_at?->format('d/m/Y h:i A'),
        ];
    }
}
