<?php

namespace Database\Seeders;

use App\Models\SkillCategory;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $skills = [
            [
                'name' => 'WordPress',
                'slug' => 'wordpress',
                'status' => 'active',
            ],
            [
                'name' => 'React',
                'slug' => 'react',
                'status' => 'active',
            ],
            [
                'name' => 'PHP',
                'slug' => 'php',
                'status' => 'active',
            ],
            [
                'name' => 'Laravel',
                'slug' => 'laravel',
                'status' => 'active',
            ],
            [
                'name' => 'SEO',
                'slug' => 'seo',
                'status' => 'active',
            ],
            [
                'name' => 'JavaScript',
                'slug' => 'javascript',
                'status' => 'active',
            ],
            [
                'name' => 'Node.js',
                'slug' => 'node-js',
                'status' => 'active',
            ],
            [
                'name' => 'Vue.js',
                'slug' => 'vue-js',
                'status' => 'active',
            ],
            [
                'name' => 'Angular',
                'slug' => 'angular',
                'status' => 'active',
            ],
        ];
        foreach ($skills as $skill) {
            SkillCategory::create($skill);
        }
    }
}
