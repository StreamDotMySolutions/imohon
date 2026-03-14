<?php

namespace Tests\Feature;

use App\Enums\DepartmentType;
use App\Enums\RoleName;
use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminDepartmentManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (RoleName::cases() as $role) {
            Role::findOrCreate($role->value, 'web');
        }

        $hqDepartment = Department::query()->create([
            'name' => 'HQ',
            'type' => DepartmentType::HQ,
        ]);

        $admin = User::factory()->create([
            'department_id' => $hqDepartment->id,
        ]);
        $admin->assignRole(RoleName::Admin->value);

        Sanctum::actingAs($admin);
    }

    public function test_admin_can_list_departments(): void
    {
        Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $this->getJson('/api/admin/departments')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Operations');
    }

    public function test_admin_can_create_department(): void
    {
        $this->postJson('/api/admin/departments', [
            'name' => 'Procurement',
            'type' => DepartmentType::Regular->value,
        ])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Procurement')
            ->assertJsonPath('data.type', DepartmentType::Regular->value);

        $this->assertDatabaseHas('departments', [
            'name' => 'Procurement',
            'type' => DepartmentType::Regular->value,
        ]);
    }

    public function test_department_name_must_be_unique(): void
    {
        Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $this->postJson('/api/admin/departments', [
            'name' => 'Operations',
            'type' => DepartmentType::Regular->value,
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('name');
    }

    public function test_admin_can_update_department(): void
    {
        $department = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $this->putJson("/api/admin/departments/{$department->id}", [
            'name' => 'Operations HQ',
            'type' => DepartmentType::HQ->value,
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Operations HQ')
            ->assertJsonPath('data.type', DepartmentType::HQ->value);
    }

    public function test_admin_cannot_delete_department_with_users(): void
    {
        $department = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        User::factory()->create([
            'department_id' => $department->id,
        ]);

        $this->deleteJson("/api/admin/departments/{$department->id}")
            ->assertUnprocessable()
            ->assertJsonValidationErrors('department');
    }

    public function test_admin_can_delete_department_without_users(): void
    {
        $department = Department::query()->create([
            'name' => 'Archive',
            'type' => DepartmentType::Regular,
        ]);

        $this->deleteJson("/api/admin/departments/{$department->id}")
            ->assertOk();

        $this->assertDatabaseMissing('departments', [
            'id' => $department->id,
        ]);
    }
}
