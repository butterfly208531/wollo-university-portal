<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Policy;
use Illuminate\Http\JsonResponse;

class AnalyticsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'total_policies'   => Policy::count(),
            'published'        => Policy::where('status', 'published')->count(),
            'drafts'           => Policy::where('status', 'draft')->count(),
            'total_categories' => Category::count(),
            'recent_activity'  => AuditLog::with('admin:id,name')
                ->latest()
                ->limit(10)
                ->get(),
            'policies_by_category' => Category::withCount('policies')
                ->orderBy('order')
                ->get()
                ->map(fn($c) => ['name' => $c->name_en, 'count' => $c->policies_count]),
        ]);
    }
}
