<?php

namespace App\Http\Controllers;

use App\Models\Policy;
use App\Models\PolicyVersion;
use App\Traits\Auditable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PolicyController extends Controller
{
    use Auditable;

    // GET /api/policies
    public function index(Request $request): JsonResponse
    {
        $query = Policy::with('category')->where('status', 'published');

        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        $sort = $request->get('sort', 'newest');
        match ($sort) {
            'oldest' => $query->oldest(),
            'az'     => $query->orderBy('title_en'),
            'za'     => $query->orderByDesc('title_en'),
            default  => $query->latest(),
        };

        $policies = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'data'  => $policies->map(fn($p) => $p->toApiArray()),
            'meta'  => [
                'total'        => $policies->total(),
                'current_page' => $policies->currentPage(),
                'last_page'    => $policies->lastPage(),
                'per_page'     => $policies->perPage(),
            ],
        ]);
    }

    // GET /api/policies/{id}
    public function show(int $id): JsonResponse
    {
        $policy = Policy::with('category')->where('status', 'published')->findOrFail($id);
        return response()->json($policy->toApiArray());
    }

    // GET /api/search
    public function search(Request $request): JsonResponse
    {
        $q = $request->get('q', '');
        if (! $q) return response()->json(['data' => [], 'meta' => ['total' => 0]]);

        $policies = Policy::with('category')
            ->where('status', 'published')
            ->where(function ($query) use ($q) {
                $query->where('title_en', 'like', "%{$q}%")
                    ->orWhere('title_am', 'like', "%{$q}%")
                    ->orWhere('content_en', 'like', "%{$q}%")
                    ->orWhere('content_am', 'like', "%{$q}%")
                    ->orWhereJsonContains('tags', $q);
            })
            ->paginate(20);

        return response()->json([
            'data' => $policies->map(fn($p) => $p->toApiArray()),
            'meta' => ['total' => $policies->total()],
        ]);
    }

    // GET /api/search/suggest
    public function suggest(Request $request): JsonResponse
    {
        $q = $request->get('q', '');
        if (strlen($q) < 2) return response()->json([]);

        $suggestions = Policy::where('status', 'published')
            ->where('title_en', 'like', "%{$q}%")
            ->limit(5)
            ->pluck('title_en');

        return response()->json($suggestions);
    }

    // ── Admin endpoints ──────────────────────────────────────────────────────

    // GET /api/admin/policies
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Policy::with('category');

        if ($request->search) {
            $query->where('title_en', 'like', "%{$request->search}%");
        }
        if ($request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }
        if ($request->status) {
            $query->where('status', $request->status);
        }

        $policies = $query->latest()->paginate(20);

        return response()->json([
            'data' => $policies->map(fn($p) => $p->toApiArray()),
            'meta' => ['total' => $policies->total(), 'last_page' => $policies->lastPage()],
        ]);
    }

    // POST /api/admin/policies
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title_en'    => 'required|string|max:500',
            'title_am'    => 'nullable|string|max:500',
            'content_en'  => 'required|string',
            'content_am'  => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'page_number' => 'nullable|integer',
            'tags'        => 'nullable|array',
            'status'      => 'in:published,draft',
        ]);

        $data['created_by'] = auth('admin')->id();
        $data['updated_by'] = auth('admin')->id();
        $data['version']    = '1.0';

        $policy = Policy::create($data);
        $this->audit('CREATE', 'Policy', $policy->id, ['title' => $policy->title_en]);

        return response()->json($policy->load('category')->toApiArray(), 201);
    }

    // PUT /api/admin/policies/{id}
    public function update(Request $request, int $id): JsonResponse
    {
        $policy = Policy::findOrFail($id);

        $data = $request->validate([
            'title_en'    => 'sometimes|required|string|max:500',
            'title_am'    => 'nullable|string|max:500',
            'content_en'  => 'sometimes|required|string',
            'content_am'  => 'nullable|string',
            'category_id' => 'sometimes|exists:categories,id',
            'page_number' => 'nullable|integer',
            'tags'        => 'nullable|array',
            'status'      => 'in:published,draft',
            'change_summary' => 'nullable|string',
        ]);

        // Save version snapshot before updating
        PolicyVersion::create([
            'policy_id'      => $policy->id,
            'version'        => $policy->version,
            'title_en'       => $policy->title_en,
            'title_am'       => $policy->title_am,
            'content_en'     => $policy->content_en,
            'content_am'     => $policy->content_am,
            'change_summary' => $data['change_summary'] ?? 'Updated',
            'created_by'     => auth('admin')->id(),
        ]);

        // Bump version
        $parts = explode('.', $policy->version);
        $data['version']    = $parts[0] . '.' . ((int)($parts[1] ?? 0) + 1);
        $data['updated_by'] = auth('admin')->id();
        unset($data['change_summary']);

        $policy->update($data);
        $this->audit('UPDATE', 'Policy', $policy->id, ['title' => $policy->title_en]);

        return response()->json($policy->fresh('category')->toApiArray());
    }

    // DELETE /api/admin/policies/{id}
    public function destroy(int $id): JsonResponse
    {
        $policy = Policy::findOrFail($id);
        $this->audit('DELETE', 'Policy', $id, ['title' => $policy->title_en]);
        $policy->delete();
        return response()->json(['message' => 'Deleted']);
    }

    // GET /api/admin/policies/{id}/versions
    public function versions(int $id): JsonResponse
    {
        $versions = PolicyVersion::where('policy_id', $id)
            ->with('creator:id,name')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($versions);
    }

    // POST /api/admin/policies/{id}/restore/{versionId}
    public function restore(int $id, int $versionId): JsonResponse
    {
        $policy  = Policy::findOrFail($id);
        $version = PolicyVersion::where('policy_id', $id)->findOrFail($versionId);

        // Save current as version first
        PolicyVersion::create([
            'policy_id'      => $policy->id,
            'version'        => $policy->version,
            'title_en'       => $policy->title_en,
            'title_am'       => $policy->title_am,
            'content_en'     => $policy->content_en,
            'content_am'     => $policy->content_am,
            'change_summary' => 'Auto-saved before restore',
            'created_by'     => auth('admin')->id(),
        ]);

        $policy->update([
            'title_en'   => $version->title_en,
            'title_am'   => $version->title_am,
            'content_en' => $version->content_en,
            'content_am' => $version->content_am,
            'version'    => $version->version . '-restored',
            'updated_by' => auth('admin')->id(),
        ]);

        $this->audit('RESTORE', 'Policy', $id, ['restored_version' => $version->version]);
        return response()->json($policy->fresh('category')->toApiArray());
    }
}
