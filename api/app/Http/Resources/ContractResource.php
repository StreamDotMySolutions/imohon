<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contract_number' => $this->contract_number,
            'vendor_id' => $this->vendor_id,
            'vendor' => $this->vendor ? [
                'id' => $this->vendor->id,
                'name' => $this->vendor->name,
                'active' => $this->vendor->active,
            ] : null,
            'items' => $this->items->map(fn($item) => [
                'id' => $item->id,
                'category_id' => $item->category_id,
                'category_name' => $item->category?->name,
                'quantity' => $item->quantity,
            ]),
            'date_start' => $this->date_start?->format('d/m/Y h:i A'),
            'date_start_raw' => $this->date_start?->toDateString(),
            'date_end' => $this->date_end?->format('d/m/Y h:i A'),
            'date_end_raw' => $this->date_end?->toDateString(),
            'date_delivery' => $this->date_delivery?->format('d/m/Y h:i A'),
            'date_delivery_raw' => $this->date_delivery?->toDateString(),
            'active' => $this->active,
            'created_at' => $this->created_at?->format('d/m/Y h:i A'),
            'updated_at' => $this->updated_at?->format('d/m/Y h:i A'),
        ];
    }
}
