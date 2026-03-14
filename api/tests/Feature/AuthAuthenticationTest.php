<?php

namespace Tests\Feature;

use App\Enums\DepartmentType;
use App\Enums\RoleName;
use App\Models\Department;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (RoleName::cases() as $role) {
            Role::findOrCreate($role->value, 'web');
        }
    }

    public function test_user_can_login_and_receive_profile_payload(): void
    {
        $department = Department::query()->create([
            'name' => 'HQ',
            'type' => DepartmentType::HQ,
        ]);

        $user = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password',
            'department_id' => $department->id,
        ]);
        $user->assignRole(RoleName::Admin->value);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'Admin User')
            ->assertJsonPath('data.email', 'admin@example.com')
            ->assertJsonPath('data.role', RoleName::Admin->value);

        $this->assertAuthenticatedAs($user);
    }

    public function test_system_user_can_login_and_receive_system_role_payload(): void
    {
        $department = Department::query()->create([
            'name' => 'HQ',
            'type' => DepartmentType::HQ,
        ]);

        $user = User::factory()->create([
            'name' => 'System User',
            'email' => 'system@example.com',
            'password' => 'password',
            'department_id' => $department->id,
        ]);
        $user->assignRole(RoleName::System->value);

        $response = $this->postJson('/api/login', [
            'email' => 'system@example.com',
            'password' => 'password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'System User')
            ->assertJsonPath('data.email', 'system@example.com')
            ->assertJsonPath('data.role', RoleName::System->value);

        $this->assertAuthenticatedAs($user);
    }

    public function test_invalid_login_returns_validation_error(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'missing@example.com',
            'password' => 'wrong-password',
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors('email');
    }

    public function test_me_requires_authentication(): void
    {
        $this->getJson('/api/me')->assertUnauthorized();
    }

    public function test_me_returns_authenticated_user_profile(): void
    {
        $department = Department::query()->create([
            'name' => 'Operations',
            'type' => DepartmentType::Regular,
        ]);

        $user = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'department_id' => $department->id,
        ]);
        $user->assignRole(RoleName::User->value);

        $this->actingAs($user);

        $this->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.name', 'Regular User')
            ->assertJsonPath('data.email', 'user@example.com')
            ->assertJsonPath('data.role', RoleName::User->value);
    }

    public function test_logout_clears_session(): void
    {
        $department = Department::query()->create([
            'name' => 'Vendor',
            'type' => DepartmentType::Vendor,
        ]);

        $user = User::factory()->create([
            'email' => 'vendor@example.com',
            'department_id' => $department->id,
        ]);
        $user->assignRole(RoleName::Vendor->value);

        $this->actingAs($user);

        $this->postJson('/api/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logout successful.');

        Auth::forgetGuards();
        $this->getJson('/api/me')->assertUnauthorized();
    }
}
