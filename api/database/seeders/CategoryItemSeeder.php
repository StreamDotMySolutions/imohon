<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoryItemSeeder extends Seeder
{
    public function run(): void
    {
        $computer = Category::where('slug', 'computer')->first();

        if (! $computer) {
            return;
        }

        // $computer->saveAsRoot();
        // $computer->refresh();

        $items = [
            ['name' => 'Mechanical Keyboards', 'slug' => 'mechanical-keyboards'],
            ['name' => 'Gaming Mice', 'slug' => 'gaming-mice'],
            ['name' => 'Ultra-wide Monitors', 'slug' => 'ultra-wide-monitors'],
            ['name' => 'USB-C Hubs', 'slug' => 'usb-c-hubs'],
            ['name' => 'RGB Speakers', 'slug' => 'rgb-speakers'],
            ['name' => 'Webcams', 'slug' => 'webcams'],
            ['name' => 'Headsets', 'slug' => 'headsets'],
            ['name' => 'External Storage', 'slug' => 'external-storage'],
            ['name' => 'Mouse Pads', 'slug' => 'mouse-pads'],
            ['name' => 'Docking Stations', 'slug' => 'docking-stations'],
        ];

        foreach ($items as $item) {
            $node = Category::firstOrNew(['slug' => $item['slug']]);
            $node->fill([
                'name' => $item['name'],
                'description' => "{$item['name']} for computer setups.",
                'is_active' => true,
                'type' => Category::TYPE_ITEM,
            ]);

            if ($node->isDirty()) {
                $node->save();
                $node->appendToNode($computer)->save();
            }
        }
    }
}
