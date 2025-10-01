<?php

namespace App\Http\Controllers\Admin;

use App\Enums\MainStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Banks\BankRequest;
use App\Http\Resources\BankDetailsResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\BankDetails\BankDetailsInterface;
use App\Services\CountryService\CountryService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class BankDetailsController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected BankDetailsInterface $bankDetailsInterface,
        protected CountryService $countryService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'bank_name';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        $bankDetails = BankDetailsResource::collection($this->bankDetailsInterface->filter($filters));
        $countries = $this->countryService->getCountries();

        return Inertia::render('Admin/BankDetails/All/Index', [
            'filters' => $filters,
            'bankDetails' => $bankDetails,
            'countryMap' => $countries,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $countries = $this->countryService->getCountries();
        $bankDetail = $this->bankDetailsInterface->findByColumn(['status' => 'draft']);
        if (! $bankDetail) {
            $bankDetail = $this->bankDetailsInterface->create([
                'status' => MainStatusEnum::Draft->value,
            ]);
        }

        return Inertia::render('Admin/BankDetails/Edit/Index', [
            'type' => 'create',
            'bankDetail' => $bankDetail,
            'countryMap' => $countries,
            'bankStatus' => $this->enumToSelect(MainStatusEnum::cases()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function edit(int $id)
    {

        $bankDetail = $this->bankDetailsInterface->findById($id);

        if (! $bankDetail) {
            return redirect()->back()->with('error', ['Bank not found.', $this->randomKey()]);
        }

        $countries = $this->countryService->getCountries();

        return Inertia::render('Admin/BankDetails/Edit/Index', [
            'type' => 'edit',
            'bankDetail' => $bankDetail,
            'countryMap' => $countries,
            'bankStatus' => $this->enumToSelect(MainStatusEnum::cases()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(BankRequest $request, string $id)
    {
        $data = $request->all();
        $bankDetail = $this->bankDetailsInterface->findById($id);
        if (! $bankDetail) {
            return redirect()->route('admin.bank-details.index')->with('error', ['Bank detail not found.', $this->randomKey()]);
        }
        $this->bankDetailsInterface->update($id, $data);

        return redirect(route('admin.bank-details.index'))->with('success', 'Bank Detail '.($data['type'] == 'edit' ? 'Updated' : 'Created').' Successfully. ', $this->randomKey());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $package = $this->bankDetailsInterface->findById($id);
        $package->delete();

        return redirect()->back()->with('success', ['Bank detail Deleted Successfully.', $this->randomKey()]);
    }
}
