<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Pages\PageInterface;
use Inertia\Inertia;

class ContactUsController extends Controller
{
    use UtilityTrait;

    public function __construct(protected PageInterface $pageInterface) {}

    /**
     * Display a listing of the resource.
     */
    public function contact()
    {
        $about = $this->pageInterface->getByColumn(['key' => 'about_us'])->first();

        return Inertia::render('Contact/Index', ['about' => $about]);
    }
}
