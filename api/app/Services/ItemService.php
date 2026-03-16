<?php

namespace App\Services;

use App\Models\Item;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ItemService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Item::query()
            ->with(['contract', 'category', 'vendor'])
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (!empty($filters['search'])) {
            $search = trim((string) $filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereHas('category', fn($q) => $q->where('name', 'like', "%$search%"))
                  ->orWhereHas('contract', fn($q) => $q->where('contract_number', 'like', "%$search%"))
                  ->orWhereHas('vendor', fn($q) => $q->where('name', 'like', "%$search%"));
            });
        }

        return $query->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function updateStatus(Item $item, array $data): Item
    {
        $item->update([
            'status' => $data['status'],
            'notes' => $data['notes'] ?? $item->notes,
        ]);

        return $item->fresh(['category', 'vendor', 'contract']);
    }
}
