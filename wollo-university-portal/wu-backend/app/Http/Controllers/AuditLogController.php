<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('admin:id,name,email')->latest();

        if ($request->action) {
            $query->where('action', $request->action);
        }
        if ($request->resource_type) {
            $query->where('resource_type', $request->resource_type);
        }
        if ($request->admin_id) {
            $query->where('admin_id', $request->admin_id);
        }

        $logs = $query->paginate(50);

        return response()->json([
            'data' => $logs->items(),
            'meta' => ['total' => $logs->total(), 'last_page' => $logs->lastPage()],
        ]);
    }
}
