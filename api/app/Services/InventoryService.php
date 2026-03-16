<?php

namespace App\Services;

use App\Models\Inventory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Inventory::query()
            ->with(['contract.vendor', 'category'])
            ->orderByDesc('created_at');

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['vendor_id'])) {
            $query->whereHas('contract', fn($q) => $q->where('vendor_id', $filters['vendor_id']));
        }

        if (!empty($filters['search'])) {
            $search = trim((string) $filters['search']);

            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('reference_number', 'like', '%' . $search . '%')
                    ->orWhereHas('category', fn($q) => $q->where('name', 'like', '%' . $search . '%'))
                    ->orWhereHas('contract', fn($q) => $q->where('contract_number', 'like', '%' . $search . '%'))
                    ->orWhereHas('contract.vendor', fn($q) => $q->where('name', 'like', '%' . $search . '%'));
            });
        }

        return $query->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function summary(): array
    {
        $totalUnits = Inventory::sum('total');

        $byCategory = DB::table('inventories')
            ->join('categories', 'inventories.category_id', '=', 'categories.id')
            ->select('categories.id', 'categories.name', DB::raw('SUM(inventories.total) as total'))
            ->groupBy('categories.id', 'categories.name')
            ->orderByDesc(DB::raw('SUM(inventories.total)'))
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'id' => $row->id,
                'name' => $row->name,
                'total' => $row->total,
            ]);

        $byVendor = DB::table('inventories')
            ->join('contracts', 'inventories.contract_id', '=', 'contracts.id')
            ->join('vendors', 'contracts.vendor_id', '=', 'vendors.id')
            ->select('vendors.id', 'vendors.name', DB::raw('SUM(inventories.total) as total'))
            ->groupBy('vendors.id', 'vendors.name')
            ->orderByDesc(DB::raw('SUM(inventories.total)'))
            ->limit(5)
            ->get()
            ->map(fn($row) => [
                'id' => $row->id,
                'name' => $row->name,
                'total' => $row->total,
            ]);

        return [
            'total_units' => $totalUnits ?? 0,
            'by_category' => $byCategory,
            'by_vendor' => $byVendor,
        ];
    }
}
