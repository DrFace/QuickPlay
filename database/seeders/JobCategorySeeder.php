<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;

class JobCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = [
            [
                'name' => 'Web, Mobile & Software Development',
                'slug' => 'web-mobile-software-development',
                'status' => 'active',
            ],
            [
                'name' => 'Engineering & Architecture',
                'slug' => 'engineering-architecture',
                'status' => 'active',
            ],
            [
                'name' => 'Design & Creative',
                'slug' => 'design-creative',
                'status' => 'active',
            ],
            [
                'name' => 'Data Science & Analytics',
                'slug' => 'data-science-analytics',
                'status' => 'active',
            ],

        ];

        foreach ($categories as $category) {
            JobCategory::create($category);
        }

    }
}
