<?php

namespace App\Services;

use App\Models\Contract;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class ContractService
{
    public function paginate(array $filters): LengthAwarePaginator
    {
        $query = Contract::query()
            ->with(['vendor', 'items.category'])
            ->orderByDesc('created_at');

        if (! empty($filters['category_id'])) {
            $query->whereHas('items', fn($q) => $q->where('category_id', $filters['category_id']));
        }

        if (! empty($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (isset($filters['active']) && $filters['active'] !== '') {
            $query->where('active', (bool) $filters['active']);
        }

        if (! empty($filters['search'])) {
            $search = trim((string) $filters['search']);

            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('contract_number', 'like', '%' . $search . '%')
                    ->orWhereHas('vendor', fn($q) => $q->where('name', 'like', '%' . $search . '%'));
            });
        }

        return $query->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): Contract
    {
        $contract = Contract::create([
            'contract_number' => $data['contract_number'],
            'vendor_id' => $data['vendor_id'] ?? null,
            'date_start' => $data['date_start'],
            'date_end' => $data['date_end'] ?? null,
            'date_delivery' => $data['date_delivery'] ?? null,
            'active' => $data['active'] ?? true,
        ]);

        foreach ($data['items'] as $item) {
            $contract->items()->create([
                'category_id' => $item['category_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return $this->refreshContract($contract);
    }

    public function update(Contract $contract, array $data): Contract
    {
        $contract->fill(Arr::only($data, [
            'contract_number',
            'vendor_id',
            'date_start',
            'date_end',
            'date_delivery',
            'active',
        ]));

        $contract->save();

        $contract->items()->delete();
        foreach ($data['items'] as $item) {
            $contract->items()->create([
                'category_id' => $item['category_id'],
                'quantity' => $item['quantity'],
            ]);
        }

        return $this->refreshContract($contract);
    }

    public function delete(Contract $contract): void
    {
        $contract->delete();
    }

    public function refreshContract(Contract $contract): Contract
    {
        return Contract::query()
            ->with(['vendor', 'items.category'])
            ->findOrFail($contract->id);
    }
}
