<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $departments = Department::query()
            ->withCount('users')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        $departments->through(fn (Department $department) => $this->transformDepartment($department));

        return response()->json($departments);
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = Department::query()->create($request->validated());

        return response()->json([
            'message' => 'Department created successfully.',
            'data' => $this->transformDepartment($department->loadCount('users')),
        ], 201);
    }

    public function show(Department $department): JsonResponse
    {
        return response()->json([
            'data' => $this->transformDepartment($department->loadCount('users')),
        ]);
    }

    public function update(UpdateDepartmentRequest $request, Department $department): JsonResponse
    {
        $department->update($request->validated());

        return response()->json([
            'message' => 'Department updated successfully.',
            'data' => $this->transformDepartment($department->loadCount('users')),
        ]);
    }

    public function destroy(Department $department): JsonResponse
    {
        if ($department->users()->exists()) {
            return response()->json([
                'message' => 'Department cannot be deleted while users are assigned to it.',
                'errors' => [
                    'department' => ['Department cannot be deleted while users are assigned to it.'],
                ],
            ], 422);
        }

        $department->delete();

        return response()->json([
            'message' => 'Department deleted successfully.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformDepartment(Department $department): array
    {
        return [
            'id' => $department->id,
            'name' => $department->name,
            'type' => $department->type->value,
            'users_count' => $department->users_count ?? 0,
            'created_at' => $department->created_at,
            'updated_at' => $department->updated_at,
        ];
    }
}
