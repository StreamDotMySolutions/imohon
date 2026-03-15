<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $computer = Category::where('slug', 'computer')->first();

        if (! $computer) {
            // Create root using raw query to bypass trait
            DB::table('categories')->insert([
                'name' => 'Computer',
                'slug' => 'computer',
                'description' => 'Root node for computer-related inventory.',
                'is_active' => true,
                'type' => Category::TYPE_FOLDER,
                'parent_id' => null,
                '_lft' => 1,
                '_rgt' => 12,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $computer = Category::where('slug', 'computer')->first();
        }

        $children = [
            ['name' => 'Mechanical Keyboards', 'slug' => 'mechanical-keyboards'],
            ['name' => 'Gaming Mice', 'slug' => 'gaming-mice'],
            ['name' => 'Ultra-wide Monitors', 'slug' => 'ultra-wide-monitors'],
            ['name' => 'USB-C Hubs', 'slug' => 'usb-c-hubs'],
            ['name' => 'Webcams', 'slug' => 'webcams'],
        ];

        foreach ($children as $index => $item) {
            $existing = Category::where('slug', $item['slug'])->first();

            if ($existing && $existing->parent_id === $computer->id) {
                // Already exists with correct parent
                continue;
            }

            if ($existing) {
                // Update existing
                DB::table('categories')->where('id', $existing->id)->update([
                    'name' => $item['name'],
                    'description' => "{$item['name']} for computer setups.",
                    'parent_id' => $computer->id,
                    '_lft' => 1 + ($index * 2),
                    '_rgt' => 2 + ($index * 2),
                ]);
            } else {
                // Create new with sequential nested set values
                DB::table('categories')->insert([
                    'name' => $item['name'],
                    'slug' => $item['slug'],
                    'description' => "{$item['name']} for computer setups.",
                    'is_active' => true,
                    'type' => Category::TYPE_ITEM,
                    'parent_id' => $computer->id,
                    '_lft' => 1 + ($index * 2),
                    '_rgt' => 2 + ($index * 2),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
