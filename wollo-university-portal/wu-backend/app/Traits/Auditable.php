<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;

trait Auditable
{
    protected function audit(string $action, string $resourceType, ?int $resourceId = null, array $changes = []): void
    {
        AuditLog::create([
            'admin_id'      => Auth::guard('admin')->id(),
            'action'        => $action,
            'resource_type' => $resourceType,
            'resource_id'   => $resourceId,
            'changes'       => $changes,
            'ip_address'    => request()->ip(),
        ]);
    }
}
