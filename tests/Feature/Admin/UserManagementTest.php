<?php

use App\Models\User;

it('allows only administrators to view user management', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $teacher = User::factory()->create(['role' => 'teacher']);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk();

    $this->actingAs($teacher)
        ->get(route('admin.users.index'))
        ->assertForbidden();
});

it('allows an administrator to change a user role', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $this->actingAs($admin)
        ->patch(route('admin.users.role', $student), ['role' => 'teacher'])
        ->assertRedirect();

    expect($student->refresh()->role)->toBe('teacher');
});

it('deactivates and reactivates an account without deleting its record', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $student = User::factory()->create(['role' => 'student']);

    $this->actingAs($admin)
        ->patch(route('admin.users.deactivate', $student))
        ->assertRedirect();

    expect($student->refresh()->is_active)->toBeFalse()
        ->and($student->deactivated_at)->not->toBeNull();

    $this->actingAs($admin)
        ->patch(route('admin.users.activate', $student))
        ->assertRedirect();

    expect($student->refresh()->is_active)->toBeTrue()
        ->and($student->deactivated_at)->toBeNull();
    $this->assertDatabaseHas('users', ['id' => $student->id]);
});

it('prevents an administrator from deactivating their own account', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->patch(route('admin.users.deactivate', $admin))
        ->assertStatus(422);

    expect($admin->refresh()->is_active)->toBeTrue();
});

it('protects the last active administrator from demotion or deactivation', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $manager = User::factory()->create(['role' => 'teacher']);

    $this->withoutMiddleware('admin-only')->actingAs($manager)
        ->patch(route('admin.users.role', $admin), ['role' => 'teacher'])
        ->assertStatus(422);

    $this->withoutMiddleware('admin-only')->actingAs($manager)
        ->patch(route('admin.users.deactivate', $admin))
        ->assertStatus(422);

    expect($admin->refresh()->role)->toBe('admin')
        ->and($admin->is_active)->toBeTrue();
});

it('blocks a deactivated account from authenticated pages', function () {
    $user = User::factory()->create(['is_active' => false]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors('email');
});

it('does not authenticate a deactivated account', function () {
    $user = User::factory()->create(['email' => 'inactive@example.com', 'is_active' => false]);

    $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    expect(auth()->check())->toBeFalse();
});
