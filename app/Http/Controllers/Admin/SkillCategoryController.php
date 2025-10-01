<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SkillCategoryStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SkillCategoryRequest;
use App\Http\Resources\SkillCategoryResource;
use App\Http\Traits\UtilityTrait;
use App\Models\SkillCategory;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class SkillCategoryController extends Controller
{
    use UtilityTrait;

    public function __construct(protected SkillCategoryInterface $skillCategoryInterface) {}

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

        return Inertia::render('Admin/SkillCategories/All/Index', [
            'filters' => $filters,
            'skills' => SkillCategoryResource::collection($this->skillCategoryInterface->filter($filters)),
            'categoryStatus' => $this->enumToSelect(SkillCategoryStatusEnum::cases()),
        ]);
    }

    /*/**
     * Undocumented function
     *
     * @return void
     */
    public function create()
    {
        $skill = $this->skillCategoryInterface->findByColumn(['status' => SkillCategoryStatusEnum::Draft->value]);
        if (! $skill) {
            $skill = $this->skillCategoryInterface->create([
                'name' => '',
                'status' => SkillCategoryStatusEnum::Draft->value,
            ]);
        }

        return Inertia::render('Admin/SkillCategories/Edit/Index', [
            'skill' => $skill,
            'type' => 'create',
            'categoryStatus' => $this->enumToSelect(SkillCategoryStatusEnum::cases()),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(?SkillCategory $skill = null)
    {
        return Inertia::render('Admin/SkillCategories/Edit/Index', [
            'skill' => $skill,
            'type' => 'edit',
            'categoryStatus' => $this->enumToSelect(SkillCategoryStatusEnum::cases()),
        ]);
    }

    /**
     * updateSkillCategory
     *
     * @param  mixed  $request
     * @param  mixed  $skill
     * @return void
     */
    public function updateSkillCategory(SkillCategoryRequest $request, int $id)
    {
        // dd($request->all());
        $data = $request->all();
        $this->skillCategoryInterface->update($id, $data);

        return redirect(route('admin.skills.index'))->with('success', 'Skill '.($data['type'] == 'edit' ? 'Updated' : 'Created').' Successfully. ', $this->randomKey());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SkillCategory $skill)
    {
        $this->skillCategoryInterface->deleteById($skill->id);

        return redirect(route('admin.skills.index'))->with('success', ['Skill Deleted Successfully', $this->randomKey()]);
    }
}
