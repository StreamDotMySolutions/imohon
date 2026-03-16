<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Inventory;
use Illuminate\Database\Seeder;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $contracts = Contract::with('items')->get();

        foreach ($contracts as $contract) {
            foreach ($contract->items as $item) {
                Inventory::updateOrCreate(
                    [
                        'contract_id' => $contract->id,
                        'category_id' => $item->category_id,
                    ],
                    [
                        'total' => $item->quantity,
                        'reference_number' => $contract->contract_number,
                        'description' => null,
                    ],
                );
            }
        }
    }
}
