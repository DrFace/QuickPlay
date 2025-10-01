<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CategoryStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\JobCategoryRequest;
use App\Http\Resources\JobCategoryResource;
use App\Http\Traits\UtilityTrait;
use App\Models\JobCategory;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class JobCategoryController extends Controller
{
    use UtilityTrait;

    public function __construct(protected JobCategoryInterface $jobCategoryInterface) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'name';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        return Inertia::render('Admin/JobCategories/All/Index', [
            'filters' => $filters,
            'categories' => JobCategoryResource::collection($this->jobCategoryInterface->filter($filters)),
            'categoryStatus' => $this->enumToSelect(CategoryStatusEnum::cases()),
        ]);
    }

    /*/**
     * Undocumented function
     *
     * @return void
     */
    public function create()
    {
        $category = $this->jobCategoryInterface->findByColumn(['status' => CategoryStatusEnum::Draft->value]);
        if (! $category) {
            $category = $this->jobCategoryInterface->create([
                'name' => '',
                'status' => CategoryStatusEnum::Draft->value,
            ]);
        }

        return Inertia::render('Admin/JobCategories/Edit/Index', [
            'category' => $category,
            'type' => 'create',
            'categoryStatus' => $this->enumToSelect(CategoryStatusEnum::cases()),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(?JobCategory $category = null)
    {
        return Inertia::render('Admin/JobCategories/Edit/Index', [
            'category' => $category,
            'type' => 'edit',
            'categoryStatus' => $this->enumToSelect(CategoryStatusEnum::cases()),
        ]);
    }

    /**
     * updateJobCategory
     *
     * @param  mixed  $request
     * @param  mixed  $category
     * @return void
     */
    public function updateCategory(JobCategoryRequest $request, JobCategory $category)
    {
        $data = $request->all();
        $this->jobCategoryInterface->update($category->id, $data);

        return redirect(route('admin.categories.index'))->with('success', 'Category '.($data['type'] == 'edit' ? 'Updated' : 'Created').' Successfully. ', $this->randomKey());

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobCategory $category)
    {
        $this->jobCategoryInterface->deleteById($category->id);

        return redirect(route('admin.categories.index'))->with('success', ['Category Deleted Successfully', $this->randomKey()]);
    }
}
