<?php

namespace App\Http\Requests;

use App\Enums\DepartmentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDepartmentRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
            'type' => ['required', Rule::in(array_column(DepartmentType::cases(), 'value'))],
        ];
    }
}
