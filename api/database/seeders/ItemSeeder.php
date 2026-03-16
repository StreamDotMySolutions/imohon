<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Item;
use Illuminate\Database\Seeder;

class ItemSeeder extends Seeder
{
    public function run(): void
    {
        $contracts = Contract::with(['items', 'vendor'])->get();
        $currentYear = now()->year;

        foreach ($contracts as $contract) {
            foreach ($contract->items as $contractItem) {
                $existing = Item::where('contract_id', $contract->id)
                    ->where('category_id', $contractItem->category_id)
                    ->count();

                $delta = $contractItem->quantity - $existing;

                if ($delta > 0) {
                    $category = $contractItem->category;
                    $categorySlug = $category->slug;

                    $rows = [];
                    for ($i = 0; $i < $delta; $i++) {
                        $itemId = Item::max('id') + 1 + $i;
                        $rows[] = [
                            'contract_id' => $contract->id,
                            'category_id' => $contractItem->category_id,
                            'vendor_id' => $contract->vendor_id,
                            'status' => 'in_stock',
                            'notes' => null,
                            'reference_id' => "{$currentYear}-{$categorySlug}-{$itemId}",
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }
                    Item::insert($rows);
                }
            }
        }
    }
}
