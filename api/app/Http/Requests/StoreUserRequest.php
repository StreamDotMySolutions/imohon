<?php

namespace App\Http\Requests;

use App\Enums\RoleName;
use App\Models\Department;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreUserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', Rule::in(RoleName::values())],
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $department = Department::query()->find($this->integer('department_id'));

            if (! $department) {
                return;
            }

            $role = RoleName::tryFrom($this->string('role')->toString());

            if (! $role) {
                return;
            }

            if (! UserDepartmentRule::isValid($role, $department)) {
                $validator->errors()->add('department_id', UserDepartmentRule::message($role));
            }
        });
    }
}
