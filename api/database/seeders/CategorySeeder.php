<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $peripherals = Category::create([
            'name' => 'Computer Peripherals',
            'slug' => 'computer-peripherals',
            'description' => 'Root category for computer-related accessories.',
            'is_active' => true,
        ]);

        $children = [
            ['name' => 'Keyboards', 'slug' => 'keyboards'],
            ['name' => 'Mice', 'slug' => 'mice'],
            ['name' => 'Monitors', 'slug' => 'monitors'],
            ['name' => 'Webcams', 'slug' => 'webcams'],
            ['name' => 'Headsets', 'slug' => 'headsets'],
            ['name' => 'Speakers', 'slug' => 'speakers'],
            ['name' => 'Docking Stations', 'slug' => 'docking-stations'],
            ['name' => 'External Storage', 'slug' => 'external-storage'],
            ['name' => 'USB Hubs', 'slug' => 'usb-hubs'],
            ['name' => 'Mouse Pads', 'slug' => 'mouse-pads'],
        ];

        foreach ($children as $child) {
            $peripherals->children()->create(array_merge($child, [
                'description' => "{$child['name']} for laptops and desktops.",
                'is_active' => true,
            ]));
        }
    }
}
