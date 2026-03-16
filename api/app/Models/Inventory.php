<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = ['contract_id', 'category_id', 'reference_number', 'total', 'description'];

    protected $casts = ['total' => 'integer'];

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
