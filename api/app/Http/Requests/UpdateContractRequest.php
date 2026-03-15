<?php

namespace App\Http\Requests;

use App\Models\Category;
use App\Models\Contract;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContractRequest extends FormRequest
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
        /** @var Contract|null $contract */
        $contract = $this->route('contract');

        return [
            'contract_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('contracts', 'contract_number')->ignore($contract?->id),
            ],
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
