<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PolicyVersion extends Model
{
    protected $fillable = [
        'policy_id', 'version', 'title_en', 'title_am',
        'content_en', 'content_am', 'change_summary', 'created_by',
    ];

    public function policy()
    {
        return $this->belongsTo(Policy::class);
    }

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }
}
