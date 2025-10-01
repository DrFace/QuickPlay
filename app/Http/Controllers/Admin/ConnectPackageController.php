<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MainStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ConnectPackageRequest;
use App\Http\Resources\ConnectPackageResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\ConnectPackage\ConnectPackageInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ConnectPackageController extends Controller
{
    use UtilityTrait;

    public function __construct(protected ConnectPackageInterface $ConnectPackageInterface) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'connects';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        return Inertia::render('Admin/ConnectPackages/All/Index', [
            'filters' => $filters,
            'connectPackages' => ConnectPackageResource::collection($this->ConnectPackageInterface->filter($filters)),
            'packageStatus' => $this->enumToSelect(MainStatusEnum::cases()),
        ]);
    }

    /*/**
     * Undocumented function
     *
     * @return void
     */
    public function create()
    {
        $package = $this->ConnectPackageInterface->findByColumn(['status' => MainStatusEnum::Draft->value]);
        if (! $package) {
            $package = $this->ConnectPackageInterface->create([
                'status' => MainStatusEnum::Draft->value,
            ]);
        }

        return Inertia::render('Admin/ConnectPackages/Edit/Index', [
            'connectPackage' => $package,
            'type' => 'create',
            'packageStatus' => $this->enumToSelect(MainStatusEnum::cases()),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $package = $this->ConnectPackageInterface->findByUuId($id);

        return Inertia::render('Admin/ConnectPackages/Edit/Index', [
            'connectPackage' => $package,
            'type' => 'edit',
            'packageStatus' => $this->enumToSelect(MainStatusEnum::cases()),
        ]);
    }

    /**
     * updateJobCategory
     *
     * @param  mixed  $request
     * @param  mixed  $category
     * @return void
     */
    public function updateConnectPackage(ConnectPackageRequest $request, string $id)
    {
        $data = $request->all();
        $data['label'] = $data['connects'].' connects for $'.$data['amount'];
        $package = $this->ConnectPackageInterface->findByUuId($id);
        $package->update($data);

        return redirect(route('admin.connect-packages.index'))->with('success', 'Connect Package '.($data['type'] == 'edit' ? 'Updated' : 'Created').' Successfully. ', $this->randomKey());

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $package = $this->ConnectPackageInterface->findByColumn(['id' => $id]);
        $package->delete();

        return redirect(route('admin.connect-packages.index'))->with('success', ['Connect Package Deleted Successfully', $this->randomKey()]);
    }
}
