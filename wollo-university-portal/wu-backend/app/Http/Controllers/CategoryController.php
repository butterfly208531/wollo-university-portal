<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount('policies')->orderBy('order')->get();
        return response()->json($categories->map(fn($c) => $c->toApiArray()));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'slug'    => 'required|string|unique:categories',
            'name_en' => 'required|string',
            'name_am' => 'nullable|string',
            'order'   => 'nullable|integer',
        ]);
        return response()->json(Category::create($data), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->update($request->validate([
            'name_en' => 'sometimes|string',
            'name_am' => 'nullable|string',
            'order'   => 'nullable|integer',
        ]));
        return response()->json($category->toApiArray());
    }

    public function destroy(int $id): JsonResponse
    {
        Category::findOrFail($id)->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
