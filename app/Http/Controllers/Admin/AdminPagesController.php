<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Pages\PageInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPagesController extends Controller
{
    use UtilityTrait;

    public function __construct(protected PageInterface $pageInterface) {}

    public function edit()
    {
        $keys = ['privacy_policy', 'terms_of_service', 'user_agreement', 'about_us'];
        $pages = [];

        foreach ($keys as $key) {
            $page = $this->pageInterface->findByColumn(['key' => $key]);

            if (! $page) {
                $page = $this->pageInterface->create([
                    'type' => 'text',
                    'key' => $key,
                    'value' => '',
                ]);
            }

            $pages[$key] = $page;
        }

        return Inertia::render('Admin/Pages/Index', [
            'page' => collect($pages),
            'type' => 'edit',
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->all();
        foreach ($data as $key => $value) {
            $page = $this->pageInterface->findByColumn(['key' => $key]);
            if ($page) {
                $page->update(['content' => $value]);
            } else {

                $this->pageInterface->create([
                    'type' => 'text',
                    'key' => $key,
                    'content' => $value,
                ]);
            }
        }

        return redirect()->back()->with('success', ['Page Updated Successfully', $this->randomKey()]);
    }
}
