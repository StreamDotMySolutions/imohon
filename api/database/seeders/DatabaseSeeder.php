<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\CategorySeeder;
use Database\Seeders\ContractSeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\InventorySeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\RoleUserSeeder;
use Database\Seeders\VendorSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DepartmentSeeder::class,
            RoleSeeder::class,
            RoleUserSeeder::class,
            CategorySeeder::class,
            VendorSeeder::class,
            ContractSeeder::class,
            InventorySeeder::class,
        ]);
    }
}
