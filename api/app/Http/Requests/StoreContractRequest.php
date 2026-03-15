<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContractRequest extends FormRequest
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
            'contract_number' => ['required', 'string', 'max:255', 'unique:contracts,contract_number'],
            'vendor_id' => ['nullable', 'integer', Rule::exists('vendors', 'id')],
            'vendor_name' => ['required_without:vendor_id', 'string', 'max:255'],
            'category_id' => [
                'required',
                'integer',
                Rule::exists('categories', 'id')->where(fn ($query) => $query->where('type', Category::TYPE_ITEM)),
            ],
            'total' => ['required', 'integer', 'min:0'],
            'date_start' => ['required', 'date'],
            'date_end' => ['nullable', 'date', 'after_or_equal:date_start'],
            'date_delivery' => ['nullable', 'date'],
            'active' => ['sometimes', 'boolean'],
        ];
    }
}
