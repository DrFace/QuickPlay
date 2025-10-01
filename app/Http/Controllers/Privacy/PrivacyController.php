<?php

namespace App\Http\Controllers\Privacy;

use App\Http\Controllers\Controller;
use App\Repositories\All\Pages\PageInterface;
use Inertia\Inertia;

class PrivacyController extends Controller
{
    public function __construct(protected PageInterface $pageInterface) {}

    /**
     * Display a listing of the resource.
     */
    public function privacy()
    {
        $privacies = $this->pageInterface->getByColumn(['key' => 'privacy_policy'])->first();

        return Inertia::render('Policy/Privacy', ['privacies' => $privacies]);
    }

    public function term()
    {
        $terms = $this->pageInterface->getByColumn(['key' => 'terms_of_service'])->first();

        return Inertia::render('Policy/Terms', ['terms' => $terms]);
    }

    public function caNotice()
    {
        $notices = $this->pageInterface->getByColumn(['key' => 'ca_notice_at_collection'])->first();

        return Inertia::render('Policy/CaNotice', ['notices' => $notices]);
    }

    public function userAgreement()
    {
        $agreements = $this->pageInterface->getByColumn(['key' => 'user_agreement'])->first();

        return Inertia::render('Policy/UserAgreement', ['agreements' => $agreements]);
    }
}
