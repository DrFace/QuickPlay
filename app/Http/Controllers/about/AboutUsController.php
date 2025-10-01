<?php

namespace App\Http\Controllers\about;

use App\Http\Controllers\Controller;
use App\Repositories\All\Pages\PageInterface;
use Inertia\Inertia;

class AboutUsController extends Controller
{
    public function __construct(protected PageInterface $pageInterface) {}

    /**
     * Display a listing of the resource.
     */
    public function about()
    {
        $about = $this->pageInterface->getByColumn(['key' => 'about_us'])->first();

        return Inertia::render('About/aboutUs', ['about' => $about]);
    }
}
