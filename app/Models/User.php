<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'student_id', 'year_level', 'profile_picture'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    protected $appends = ['avatar'];

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function downloadedModules()
    {
        return $this->belongsToMany(Module::class, 'downloads')->withTimestamps();
    }

    public function moduleAccessRequests()
    {
        return $this->hasMany(ModuleAccessRequest::class, 'student_id');
    }

    public function uploadedModules()
    {
        return $this->hasMany(Module::class, 'uploaded_by');
    }

    public function moduleLikes()
    {
        return $this->hasMany(ModuleLike::class);
    }

    public function moduleFeedback()
    {
        return $this->hasMany(ModuleFeedback::class);
    }

    public function getAvatarAttribute(): ?string
    {
        return $this->profile_picture
            ? asset('storage/' . ltrim($this->profile_picture, '/'))
            : null;
    }
}
