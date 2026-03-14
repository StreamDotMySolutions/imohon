<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::query()
            ->with(['department', 'roles'])
            ->when($request->boolean('with_trashed'), fn ($query) => $query->withTrashed())
            ->latest()
            ->paginate($request->integer('per_page', 15));

        $users->through(fn (User $user) => $this->transformUser($user));

        return response()->json($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::query()->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'department_id' => $data['department_id'],
            'is_active' => $data['is_active'] ?? true,
        ]);

        $user->syncRoles([$data['role']]);

        return response()->json([
            'message' => 'User created successfully.',
            'data' => $this->transformUser($user->load(['department', 'roles'])),
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => $this->transformUser($user->load(['department', 'roles'])),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        $payload = [
            'name' => $data['name'],
            'email' => $data['email'],
            'department_id' => $data['department_id'],
            'is_active' => $data['is_active'] ?? $user->is_active,
        ];

        if (! empty($data['password'])) {
            $payload['password'] = $data['password'];
        }

        $user->update($payload);
        $user->syncRoles([$data['role']]);

        return response()->json([
            'message' => 'User updated successfully.',
            'data' => $this->transformUser($user->load(['department', 'roles'])),
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->forceFill(['is_active' => false])->save();
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'is_active' => $user->is_active,
            'department' => $user->department ? [
                'id' => $user->department->id,
                'name' => $user->department->name,
                'type' => $user->department->type->value,
            ] : null,
            'role' => $user->getRoleNames()->first(),
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
            'deleted_at' => $user->deleted_at,
        ];
    }
}
