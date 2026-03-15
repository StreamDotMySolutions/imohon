<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Contract;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ContractSeeder extends Seeder
{
    public function run(): void
    {
        $vendors = Vendor::where('active', true)->get()->keyBy('code');
        $categories = Category::where('type', Category::TYPE_ITEM)->get()->keyBy('slug');

        if ($vendors->isEmpty() || $categories->isEmpty()) {
            return;
        }

        $entries = [
            [
                'contract_number' => 'CT-1001',
                'vendor_code' => 'VND-1001',
                'category_slug' => 'keyboards',
                'total' => 50,
                'date_start' => Carbon::now()->subMonths(1),
                'date_end' => Carbon::now()->addMonths(11),
                'date_delivery' => Carbon::now()->subDays(2),
            ],
            [
                'contract_number' => 'CT-1002',
                'vendor_code' => 'VND-1002',
                'category_slug' => 'mice',
                'total' => 80,
                'date_start' => Carbon::now()->startOfMonth(),
                'date_end' => Carbon::now()->addMonths(6),
                'date_delivery' => Carbon::now()->addDays(7),
            ],
            [
                'contract_number' => 'CT-1003',
                'vendor_code' => 'VND-1001',
                'category_slug' => 'monitors',
                'total' => 20,
                'date_start' => Carbon::now()->subMonths(2),
                'date_end' => Carbon::now()->addMonths(2),
                'date_delivery' => Carbon::now()->addDays(3),
            ],
        ];

        foreach ($entries as $entry) {
            $vendor = $vendors->get($entry['vendor_code']);
            $category = $categories->get($entry['category_slug']);

            if (! $vendor || ! $category) {
                continue;
            }

            Contract::updateOrCreate(
                ['contract_number' => $entry['contract_number']],
                [
                    'vendor_id' => $vendor->id,
                    'vendor_name' => $vendor->name,
                    'category_id' => $category->id,
                    'total' => $entry['total'],
                    'date_start' => $entry['date_start'],
                    'date_end' => $entry['date_end'],
                    'date_delivery' => $entry['date_delivery'],
                    'active' => true,
                ],
            );
        }
    }
}
