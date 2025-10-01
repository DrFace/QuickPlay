<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Method index
     *
     * @return void
     */
    public function index()
    {
        return Inertia::render('Client/Home/Index', [
            'user' => Auth::user(),
        ]);
    }
}
