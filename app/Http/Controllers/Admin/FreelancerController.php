<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\FreelancerResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class FreelancerController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected OfferInterface $offerInterface,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'id';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['user_type'] = 'freelancer';
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        $freelancers = FreelancerResource::collection($this->userInterface->filter($filters));

        return Inertia::render('Admin/Freelancers/All/Index', [
            'filters' => $filters,
            'freelancers' => $freelancers,
        ]);
    }

    public function show($id)
    {
        $freelancer = $this->userInterface->findByUuId($id);
        $activeOffers = $this->offerInterface->getByColumn(['freelancer_id' => $freelancer->id, 'status' => 'accepted']);

        return Inertia::render('Admin/Freelancers/Show/Index', [
            'freelancer' => $freelancer,
            'paymentMethods' => $freelancer->paymentMethods,
            'activeOffers' => $activeOffers,
        ]);
    }

    public function destroy($id)
    {

        $freelancer = $this->userInterface->findByUuId($id);
        $freelancer->delete();

        return redirect()->route('admin.freelancers.index')->with('success', ['Freelancer Deleted Successfully.', $this->randomKey()]);
    }
}
