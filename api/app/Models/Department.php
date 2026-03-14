<?php

namespace App\Models;

use App\Enums\DepartmentType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
    ];

    protected function casts(): array
    {
        return [
            'type' => DepartmentType::class,
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
