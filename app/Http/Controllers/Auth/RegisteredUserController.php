<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Notifications\Welcome\WelcomeNotification;
use App\Providers\RouteServiceProvider;
use App\Services\CountryService\CountryService;
use App\Services\TimeZoneService\TimeZoneService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {

        return Inertia::render(
            'Auth/Register',
            [
                'countries' => app()->make(CountryService::class)->getCountries(),
                'timeZoneOptions' => app()->make(TimeZoneService::class)->getTimeZones(),
            ]
        );
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {

        // dd($request->all());
        $data = $request->all();
        $user = User::create([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'user_type' => $data['type'],
            'country' => $data['country'],
            'time_zone' => $data['time_zone'],
        ]);

        unset($data['first_name'], $data['last_name'], $data['email'], $data['password'], $data['type'], $data['password_confirmation'], $data['country'], $data['time_zone']);
        $user->setMeta($data);
        $user->save();
        $user->profile_complete_score = 6;
        $user->save();
        event(new Registered($user));
        Auth::login($user);

        try {
            Notification::send($user, new WelcomeNotification($user->first_name));
        } catch (\Exception $e) {
        }
        if ($user->user_type === 'client') {
            $user->role()->attach(2);

            return redirect()->intended(RouteServiceProvider::CLIENT)->with('success', 'Welcome Back!');
        } elseif ($user->user_type === 'freelancer') {
            $user->role()->attach(3);

            return redirect()->intended(RouteServiceProvider::FREELANCER)->with('success', 'Welcome Back!');
        } else {
            return redirect()->intended(RouteServiceProvider::REGISTER)->with('Error', 'Register First!');
        }
    }
}
