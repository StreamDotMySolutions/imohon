<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference_id' => $this->reference_id,
            'contract_id' => $this->contract_id,
            'contract_number' => $this->contract?->contract_number,
            'category_id' => $this->category_id,
            'category_name' => $this->category?->name,
            'vendor_id' => $this->vendor_id,
            'vendor_name' => $this->vendor?->name,
            'status' => $this->status->value,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->format('d/m/Y h:i A'),
            'updated_at' => $this->updated_at?->format('d/m/Y h:i A'),
        ];
    }
}
