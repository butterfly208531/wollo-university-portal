<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Policy;
use App\Traits\Auditable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ImportController extends Controller
{
    use Auditable;

    public function import(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt|max:2048']);

        $file    = $request->file('file');
        $handle  = fopen($file->getRealPath(), 'r');
        $headers = fgetcsv($handle);
        $imported = 0;
        $errors   = [];

        while (($row = fgetcsv($handle)) !== false) {
            if (count($row) < 4) continue;

            $data = array_combine($headers, $row);

            $category = Category::where('slug', $data['category'] ?? '')->first();
            if (! $category) {
                $errors[] = "Unknown category: " . ($data['category'] ?? '');
                continue;
            }

            Policy::create([
                'title_en'    => $data['title_en'] ?? '',
                'title_am'    => $data['title_am'] ?? null,
                'content_en'  => $data['content_en'] ?? '',
                'content_am'  => $data['content_am'] ?? null,
                'category_id' => $category->id,
                'tags'        => isset($data['tags']) ? explode('|', $data['tags']) : [],
                'status'      => 'published',
                'version'     => '1.0',
                'created_by'  => auth('admin')->id(),
                'updated_by'  => auth('admin')->id(),
            ]);
            $imported++;
        }

        fclose($handle);
        $this->audit('IMPORT', 'Policy', null, ['imported' => $imported]);

        return response()->json([
            'imported' => $imported,
            'errors'   => $errors,
        ]);
    }
}
