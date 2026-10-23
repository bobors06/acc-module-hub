<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users', [
            'users' => User::query()
                ->select([
                    'id', 'name', 'email', 'student_id', 'year_level', 'role',
                    'is_active', 'deactivated_at', 'created_at',
                ])
                ->latest()
                ->get(),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['student', 'teacher', 'admin'])],
        ]);

        abort_if($request->user()->is($user), 422, 'You cannot change your own administrator role.');

        if ($user->role === 'admin' && $validated['role'] !== 'admin') {
            $this->ensureAnotherActiveAdministratorExists($user);
        }

        $user->update(['role' => $validated['role']]);

        return back()->with('success', 'User role updated.');
    }

    public function deactivate(Request $request, User $user)
    {
        abort_if($request->user()->is($user), 422, 'You cannot deactivate your own account.');
        abort_unless($user->is_active !== false, 422, 'This account is already deactivated.');

        if ($user->role === 'admin') {
            $this->ensureAnotherActiveAdministratorExists($user);
        }

        $user->update(['is_active' => false, 'deactivated_at' => Carbon::now()]);

        return back()->with('success', 'User account deactivated.');
    }

    public function activate(Request $request, User $user)
    {
        abort_unless($user->is_active === false, 422, 'This account is already active.');

        $user->update(['is_active' => true, 'deactivated_at' => null]);

        return back()->with('success', 'User account reactivated.');
    }

    private function ensureAnotherActiveAdministratorExists(User $user): void
    {
        $activeAdministrators = User::query()
            ->where('role', 'admin')
            ->where('is_active', true)
            ->where('id', '!=', $user->id)
            ->count();

        abort_if($activeAdministrators === 0, 422, 'The last active administrator cannot be demoted or deactivated.');
    }
}
