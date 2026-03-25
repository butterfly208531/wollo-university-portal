<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    protected $fillable = [
        'admin_id', 'action', 'resource_type', 'resource_id', 'changes', 'ip_address',
    ];

    protected $casts = ['changes' => 'array'];

    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
