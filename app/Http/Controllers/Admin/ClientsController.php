<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminClientResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ClientsController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected JobInterface $jobInterface,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'first_name';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['user_type'] = 'client';
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        $clients = AdminClientResource::collection($this->userInterface->filter($filters));

        return Inertia::render('Admin/Clients/All/Index', [
            'filters' => $filters,
            'clients' => $clients,
        ]);
    }

    public function show(string $id)
    {
        $client = $this->userInterface->findByUuId($id);
        $jobs = $this->jobInterface->getByColumn(['user_id' => $client->id, 'status' => 'active']);

        // dd($jobs);
        return Inertia::render('Admin/Clients/Show/Index', [
            'client' => $client,
            'jobs' => $jobs,
        ]);
    }

    public function destroy(string $id)
    {
        $client = $this->userInterface->findByUuId($id);
        $client->delete();

        return redirect()->route('admin.clients.index')->with('success', ['Client Deleted Successfully.', $this->randomKey()]);
    }
}
