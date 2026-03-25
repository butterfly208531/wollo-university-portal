<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtAdminMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        try {
            $admin = auth('admin')->setToken(
                JWTAuth::getToken() ?: JWTAuth::parseToken()->getToken()
            )->user();
        } catch (JWTException $e) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (! $admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        if (! empty($roles) && ! in_array($admin->role, $roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        auth('admin')->setUser($admin);
        return $next($request);
    }
}
