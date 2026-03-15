<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
        return [
            'type' => ['required', Rule::in([Category::TYPE_FOLDER, Category::TYPE_ITEM])],
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'slug' => ['required', 'string', 'max:255', 'unique:categories,slug'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id'),
                function ($attribute, $value, $fail): void {
                    $type = $this->input('type');
                    if ($type === Category::TYPE_FOLDER && $value) {
                        $fail('Folders cannot have a parent.');
                        return;
                    }

                    if ($type === Category::TYPE_ITEM && ! $value) {
                        $fail('Items must have a parent.');
                    }
                },
            ],
        ];
    }
}
