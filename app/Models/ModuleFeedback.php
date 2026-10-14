<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModuleFeedback extends Model
{
    protected $table = 'module_feedback';

    protected $fillable = ['module_id', 'user_id', 'comment', 'reply', 'reply_by', 'replied_at'];

    protected function casts(): array
    {
        return ['replied_at' => 'datetime'];
    }

    public function module(): BelongsTo { return $this->belongsTo(Module::class); }
    public function user(): BelongsTo { return $this->belongsTo(User::class); }
    public function replyBy(): BelongsTo { return $this->belongsTo(User::class, 'reply_by'); }
}
