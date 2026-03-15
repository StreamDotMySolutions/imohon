<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Category|null $category */
        $category = $this->route('category');
        $descendantIds = $category ? $category->descendants()->pluck('id')->toArray() : [];

        return [
            'type' => ['required', Rule::in([Category::TYPE_FOLDER, Category::TYPE_ITEM])],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category?->id),
            ],
            'slug' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($category?->id),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id'),
                function ($attribute, $value, $fail) use ($category, $descendantIds): void {
                    $type = $this->input('type');

                    if ($type === Category::TYPE_ITEM && ! $value) {
                        $fail('Items must have a parent.');
                        return;
                    }

                    if (! $category || $value === null) {
                        return;
                    }

                    if ($value === $category->id || in_array($value, $descendantIds, true)) {
                        $fail('The parent category cannot be the category itself or a descendant.');
                    }
                },
            ],
        ];
    }
}
