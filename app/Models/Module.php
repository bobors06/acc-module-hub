<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Module extends Model
{
    protected $fillable = [
        'title',
        'subject',
        'year_level',
        'file_type',
        'file_size',
        'file_path',
        'is_active',
        'disabled_at',
        'disabled_by',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'is_active' => 'boolean',
            'disabled_at' => 'datetime',
        ];
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function disabledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'disabled_by');
    }
}
