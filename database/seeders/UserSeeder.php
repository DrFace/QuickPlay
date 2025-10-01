<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $users = [
            [
                'first_name' => 'System Admin',
                'email' => 'admin@axcertro.com',
                'password' => Hash::make('Axcertro@Our1st'),
                'user_type' => 'admin',
            ],
            [
                'first_name' => 'Ai-Geek admin',
                'email' => 'aigeeks786@gmail.com',
                'password' => Hash::make('ag@1qaz2wsx'),
                'user_type' => 'admin',
            ],
        ];

        foreach ($users as $user) {
            $user = User::create($user);
            $user->role()->attach(1);
        }
    }
}
