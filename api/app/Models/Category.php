<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kalnoy\Nestedset\NodeTrait;

class Category extends Model
{
    use HasFactory;
    use NodeTrait;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
        'parent_id',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime:d/m/Y H:i',
        'updated_at' => 'datetime:d/m/Y H:i',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $category): void {
            if ($category->is_active === null) {
                $category->is_active = true;
            }
        });
    }
}
