<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Notifications\SendTwoFactorConfirmation;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Display the login view.
     */
    public function adminCreate(): Response
    {
        return Inertia::render('Admin/Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $user = User::withTrashed()->where('email', $request->email)->first();

        if ($user && $user->trashed()) {
            return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact support for more information.');
        }

        if ($user && $user->two_factor_authentication) {
            $otp = random_int(100000, 999999);
            $user->otp = $otp;
            $user->save();
            Notification::route('mail', $user->email)->notify(new SendTwoFactorConfirmation($otp, $user->first_name, $user->email));

            return redirect()->route('two-factor.challenge')->with('email', $user->email);
        }

        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        $role = $user->user_type;

        if ($role === 'client') {
            return redirect()->intended(RouteServiceProvider::CLIENT)->with('success', 'Welcome back!');
        } elseif ($role === 'freelancer') {
            return redirect()->intended(RouteServiceProvider::FREELANCER)->with('success', 'Welcome back!');
        } elseif ($role === 'admin') {
            return redirect()->intended(RouteServiceProvider::ADMIN)->with('success', 'Welcome back!');
        }

        return redirect()->intended(RouteServiceProvider::REGISTER)->with('Error', 'Register first!');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'Logged Out Successfully');
    }
}
