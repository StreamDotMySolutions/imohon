<?php

namespace App\Models;

use App\Enums\ItemStatus;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['contract_id', 'category_id', 'vendor_id', 'status', 'notes', 'reference_id'];

    protected $casts = ['status' => ItemStatus::class];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function scopeInStock($query)
    {
        return $query->where('status', ItemStatus::InStock);
    }
}
