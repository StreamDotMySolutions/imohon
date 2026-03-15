<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        $vendors = [
            [
                'name' => 'Vertex Systems',
                'code' => 'VND-1001',
                'contact_person' => 'Alya Rahman',
                'phone' => '60123456789',
                'active' => true,
            ],
            [
                'name' => 'Peak Technologies',
                'code' => 'VND-1002',
                'contact_person' => 'Daniel Ong',
                'phone' => '60198765432',
                'active' => true,
            ],
            [
                'name' => 'Mekar Supplies',
                'code' => 'VND-1003',
                'contact_person' => 'Faridah Hassan',
                'phone' => '60111223344',
                'active' => false,
            ],
        ];

        foreach ($vendors as $data) {
            Vendor::updateOrCreate([
                'code' => $data['code'],
            ], $data);
        }
    }
}
