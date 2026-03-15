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
            ->with(['vendor', 'category'])
            ->orderByDesc('created_at');

        if (! empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
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
                    ->orWhere('vendor_name', 'like', '%' . $search . '%');
            });
        }

        return $query->paginate((int) ($filters['per_page'] ?? 15));
    }

    public function create(array $data): Contract
    {
        $contract = Contract::create([
            'contract_number' => $data['contract_number'],
            'vendor_id' => $data['vendor_id'] ?? null,
            'vendor_name' => $data['vendor_name'] ?? null,
            'category_id' => $data['category_id'],
            'total' => $data['total'],
            'date_start' => $data['date_start'],
            'date_end' => $data['date_end'] ?? null,
            'date_delivery' => $data['date_delivery'] ?? null,
            'active' => $data['active'] ?? true,
        ]);

        return $this->refreshContract($contract);
    }

    public function update(Contract $contract, array $data): Contract
    {
        $contract->fill(Arr::only($data, [
            'contract_number',
            'vendor_id',
            'vendor_name',
            'category_id',
            'total',
            'date_start',
            'date_end',
            'date_delivery',
            'active',
        ]));

        $contract->save();

        return $this->refreshContract($contract);
    }

    public function delete(Contract $contract): void
    {
        $contract->delete();
    }

    public function refreshContract(Contract $contract): Contract
    {
        return Contract::query()
            ->with(['vendor', 'category'])
            ->findOrFail($contract->id);
    }
}
