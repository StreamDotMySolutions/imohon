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

class AdminUserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected Department $hqDepartment;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (RoleName::cases() as $role) {
            Role::findOrCreate($role->value, 'web');
        }

        $this->hqDepartment = Department::query()->create([
            'name' => 'HQ',
            'type' => DepartmentType::HQ,
        ]);

        $this->admin = User::factory()->create([
            'department_id' => $this->hqDepartment->id,
        ]);
        $this->admin->assignRole(RoleName::Admin->value);

        Sanctum::actingAs($this->admin);
    }

    public function test_admin_can_create_user_with_regular_department(): void
    {
        $department = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $response = $this->postJson('/api/admin/users', [
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => RoleName::User->value,
            'department_id' => $department->id,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.role', RoleName::User->value)
            ->assertJsonPath('data.department.type', DepartmentType::Regular->value);

        $this->assertDatabaseHas('users', [
            'email' => 'user@example.com',
            'department_id' => $department->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_role_requires_hq_department(): void
    {
        $department = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $response = $this->postJson('/api/admin/users', [
            'name' => 'Second Admin',
            'email' => 'admin2@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => RoleName::Admin->value,
            'department_id' => $department->id,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('department_id');
    }

    public function test_vendor_requires_vendor_department(): void
    {
        $department = Department::query()->create([
            'name' => 'Vendor',
            'type' => DepartmentType::Vendor,
        ]);

        $response = $this->postJson('/api/admin/users', [
            'name' => 'Vendor User',
            'email' => 'vendor@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => RoleName::Vendor->value,
            'department_id' => $department->id,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.role', RoleName::Vendor->value)
            ->assertJsonPath('data.department.type', DepartmentType::Vendor->value);
    }

    public function test_updating_role_requires_valid_department_change(): void
    {
        $regularDepartment = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $user = User::factory()->create([
            'department_id' => $regularDepartment->id,
            'email' => 'manager@example.com',
        ]);
        $user->assignRole(RoleName::Manager->value);

        $response = $this->putJson("/api/admin/users/{$user->id}", [
            'name' => $user->name,
            'email' => $user->email,
            'role' => RoleName::Admin->value,
            'department_id' => $regularDepartment->id,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors('department_id');
    }

    public function test_admin_can_soft_delete_user(): void
    {
        $department = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $user = User::factory()->create([
            'department_id' => $department->id,
        ]);
        $user->assignRole(RoleName::User->value);

        $response = $this->deleteJson("/api/admin/users/{$user->id}");

        $response->assertOk();

        $this->assertSoftDeleted('users', [
            'id' => $user->id,
        ]);
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'is_active' => false,
        ]);
    }
}
