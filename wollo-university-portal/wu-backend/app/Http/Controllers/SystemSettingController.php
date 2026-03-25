<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Traits\Auditable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingController extends Controller
{
    use Auditable;

    private array $defaults = [
        'site_title'       => 'Wollo University Academic Portal',
        'default_language' => 'en',
        'default_theme'    => 'light',
        'maintenance_mode' => 'false',
    ];

    public function index(): JsonResponse
    {
        $settings = [];
        foreach ($this->defaults as $key => $default) {
            $settings[$key] = SystemSetting::get($key, $default);
        }
        return response()->json($settings);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'site_title'       => 'sometimes|string|max:255',
            'default_language' => 'sometimes|in:en,am',
            'default_theme'    => 'sometimes|in:light,dark',
            'maintenance_mode' => 'sometimes|boolean',
        ]);

        foreach ($data as $key => $value) {
            SystemSetting::set($key, (string) $value);
        }

        $this->audit('UPDATE', 'Settings', null, $data);
        return response()->json(['message' => 'Settings updated']);
    }
}
