<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Traits\Auditable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    use Auditable;

    public function index(): JsonResponse
    {
        return response()->json(Admin::select('id', 'name', 'email', 'role', 'is_active', 'last_login', 'created_at')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:admins',
            'password' => 'required|string|min:8',
            'role'     => 'in:admin,super_admin',
        ]);

        $data['password'] = Hash::make($data['password']);
        $admin = Admin::create($data);
        $this->audit('CREATE', 'Admin', $admin->id, ['email' => $admin->email]);

        return response()->json($admin->only('id', 'name', 'email', 'role', 'is_active'), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $admin = Admin::findOrFail($id);

        $data = $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:admins,email,' . $id,
            'password'  => 'sometimes|string|min:8',
            'role'      => 'sometimes|in:admin,super_admin',
            'is_active' => 'sometimes|boolean',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $admin->update($data);
        $this->audit('UPDATE', 'Admin', $id);

        return response()->json($admin->only('id', 'name', 'email', 'role', 'is_active'));
    }

    public function destroy(int $id): JsonResponse
    {
        $admin = Admin::findOrFail($id);

        // Prevent deleting yourself
        if ($admin->id === auth('admin')->id()) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        $this->audit('DELETE', 'Admin', $id, ['email' => $admin->email]);
        $admin->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
