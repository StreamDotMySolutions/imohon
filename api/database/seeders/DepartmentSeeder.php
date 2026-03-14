<?php

namespace Database\Seeders;

use App\Enums\DepartmentType;
use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        Department::query()->updateOrCreate(
            ['name' => 'HQ'],
            ['type' => DepartmentType::HQ]
        );

        Department::query()->updateOrCreate(
            ['name' => 'Vendor'],
            ['type' => DepartmentType::Vendor]
        );

        Department::query()->updateOrCreate(
            ['name' => 'Operations'],
            ['type' => DepartmentType::Regular]
        );
    }
}
