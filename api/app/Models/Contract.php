<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_number',
        'vendor_id',
        'vendor_name',
        'category_id',
        'total',
        'date_start',
        'date_end',
        'date_delivery',
        'active',
    ];

    protected $casts = [
        'date_start' => 'date',
        'date_end' => 'date',
        'date_delivery' => 'date',
        'active' => 'boolean',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class);
    }
}
