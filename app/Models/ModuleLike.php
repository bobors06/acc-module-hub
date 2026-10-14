<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleLike extends Model
{
    protected $fillable = ['module_id', 'user_id'];

    public function module(): BelongsTo { return $this->belongsTo(Module::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
}
