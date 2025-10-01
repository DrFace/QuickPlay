<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SportsCategoryStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SportsCategoryRequest;
use App\Http\Resources\SportsCategoryResource;
use App\Http\Traits\UtilityTrait;
use App\Models\SportsCategory;
use App\Repositories\All\SportsCategory\SportsCategoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class SportsCategoryController extends Controller
{
    use UtilityTrait;

    public function __construct(protected SportsCategoryInterface $sportsCategoryInterface) {}

    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'name';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        return Inertia::render('Admin/SportsCategories/All/Index', [
            'filters' => $filters,
            'sports' => SportsCategoryResource::collection($this->sportsCategoryInterface->filter($filters)),
            'categoryStatus' => $this->enumToSelect(SportsCategoryStatusEnum::cases()),
        ]);
    }

    public function create()
    {
        $sport = $this->sportsCategoryInterface->findByColumn(['status' => SportsCategoryStatusEnum::Draft->value]);
        if (! $sport) {
            $sport = $this->sportsCategoryInterface->create([
                'name' => '',
                'status' => SportsCategoryStatusEnum::Draft->value,
            ]);
        }

        return Inertia::render('Admin/SportsCategories/Edit/Index', [
            'sport' => $sport,
            'type' => 'create',
            'categoryStatus' => $this->enumToSelect(SportsCategoryStatusEnum::cases()),
        ]);
    }

    public function edit(?SportsCategory $sport = null)
    {
        return Inertia::render('Admin/SportsCategories/Edit/Index', [
            'sport' => $sport,
            'type' => 'edit',
            'categoryStatus' => $this->enumToSelect(SportsCategoryStatusEnum::cases()),
        ]);
    }

    public function updateSportsCategory(SportsCategoryRequest $request, int $id)
    {
        $data = $request->all();
        $this->sportsCategoryInterface->update($id, $data);

        return redirect(route('admin.sports.index'))->with(
            'success',
            'Sport '.($data['type'] == 'edit' ? 'Updated' : 'Created').' Successfully.',
            $this->randomKey()
        );
    }

    public function destroy(SportsCategory $sport)
    {
        $this->sportsCategoryInterface->deleteById($sport->id);

        return redirect(route('admin.sports.index'))->with('success', ['Sport Deleted Successfully', $this->randomKey()]);
    }
}
