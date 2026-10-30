<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleAccessRequest extends Model
{
    protected $fillable = [
        'module_id',
        'student_id',
        'status',
        'access_code',
        'approved_at',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'access_code' => 'encrypted',
            'approved_at' => 'datetime',
            'verified_at' => 'datetime',
        ];
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
