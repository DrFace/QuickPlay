<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$role)
    {
        $user = null;
        if ($request->has('email')) {
            $email = $request->input('email');
            $user = User::where('email', $email)->first();
        } else {
            $user = $request->user();
        }

        $userRole = $user->user_type;
        $userRole = ucfirst($userRole);

        if ($user && ($userRole == $role[0])) {
            return $next($request);
        }

        return response('Unauthorized.', 401);

    }
}
