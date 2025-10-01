<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate([
            'name' => 'Admin',
            'status' => 'active',
        ]);
        Role::firstOrCreate([
            'name' => 'Client',
            'status' => 'active',
        ]);
        Role::firstOrCreate([
            'name' => 'Freelancer',
            'status' => 'active',
        ]);
    }
}
