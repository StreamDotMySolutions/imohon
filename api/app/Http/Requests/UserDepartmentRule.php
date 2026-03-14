<?php

namespace App\Http\Requests;

use App\Enums\DepartmentType;
use App\Enums\RoleName;
use App\Models\Department;

class UserDepartmentRule
{
    public static function isValid(RoleName $role, Department $department): bool
    {
        return match ($role) {
            RoleName::Admin, RoleName::GeneralManager, RoleName::System => $department->type === DepartmentType::HQ,
            RoleName::Vendor => $department->type === DepartmentType::Vendor,
            RoleName::User, RoleName::Manager => $department->type === DepartmentType::Regular,
        };
    }

    public static function message(RoleName $role): string
    {
        return match ($role) {
            RoleName::Admin, RoleName::GeneralManager, RoleName::System => "The selected department must be an HQ department for the {$role->value} role.",
            RoleName::Vendor => "The selected department must be a vendor department for the {$role->value} role.",
            RoleName::User, RoleName::Manager => "The selected department must be a regular department for the {$role->value} role.",
        };
    }
}
