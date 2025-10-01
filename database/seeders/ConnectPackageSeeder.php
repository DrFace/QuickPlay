<?php

namespace Database\Seeders;

use App\Models\ConnectPackage;
use Illuminate\Database\Seeder;

class ConnectPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $ConnectPackage = [
            [
                'id' => '1',
                'connects' => '100',
                'amount' => '24',
                'label' => '100 connects for $24',
                'status' => 'active',
            ],
        ];

        foreach ($ConnectPackage as $package) {
            ConnectPackage::create($package);
        }
    }
}
