<?php

namespace Database\Seeders;

use App\Enums\RoleName;
use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleUserSeeder extends Seeder
{
    public function run(): void
    {
        $hq = Department::query()->where('name', 'HQ')->firstOrFail();
        $vendor = Department::query()->where('name', 'Vendor')->firstOrFail();
        $operations = Department::query()->where('name', 'Operations')->firstOrFail();

        $accounts = [
            [
                'name' => 'Default User',
                'email' => 'user@local',
                'role' => RoleName::User,
                'department_id' => $operations->id,
            ],
            [
                'name' => 'Default Manager',
                'email' => 'manager@local',
                'role' => RoleName::Manager,
                'department_id' => $operations->id,
            ],
            [
                'name' => 'Default Admin',
                'email' => 'admin@local',
                'role' => RoleName::Admin,
                'department_id' => $hq->id,
            ],
            [
                'name' => 'Default General Manager',
                'email' => 'generalmanager@local',
                'role' => RoleName::GeneralManager,
                'department_id' => $hq->id,
            ],
            [
                'name' => 'Default System',
                'email' => 'system@local',
                'role' => RoleName::System,
                'department_id' => $hq->id,
            ],
            [
                'name' => 'Default Vendor',
                'email' => 'vendor@local',
                'role' => RoleName::Vendor,
                'department_id' => $vendor->id,
            ],
        ];

        foreach ($accounts as $account) {
            $user = User::query()->updateOrCreate(
                ['email' => $account['email']],
                [
                    'name' => $account['name'],
                    'password' => 'password',
                    'department_id' => $account['department_id'],
                    'is_active' => true,
                ]
            );

            if ($user->trashed()) {
                $user->restore();
            }

            $user->syncRoles([$account['role']->value]);
        }
    }
}
