<?php

namespace Database\Seeders;

use App\Models\GameAddon;
use Illuminate\Database\Seeder;

class GameAddonSeeder extends Seeder
{
    public function run(): void
    {
        $addons = [
            [
                'name' => 'Development / Customization',
                'slug' => 'development',
                'description' => 'Brand the game as yours — app name, package name, logo, splash, icon, theme colors and UI branding by our development team.',
                'price' => 9999,
                'sort_order' => 1,
            ],
            [
                'name' => 'Play Store Publishing',
                'slug' => 'play-store',
                'description' => 'Complete Google Play listing support — store assets, description, screenshots guidance, policy checks and publish assistance.',
                'price' => 4999,
                'sort_order' => 2,
            ],
            [
                'name' => 'Monetize / AdMob',
                'slug' => 'monetize-admob',
                'description' => 'Google AdMob integration for banner, interstitial and rewarded ads so your game can start generating revenue.',
                'price' => 3999,
                'sort_order' => 3,
            ],
            [
                'name' => 'Marketing',
                'slug' => 'marketing',
                'description' => 'Growth support for installs and users — Meta ads strategy guidance, creatives direction and launch promotion plan.',
                'price' => 9999,
                'sort_order' => 4,
            ],
        ];

        foreach ($addons as $addon) {
            GameAddon::updateOrCreate(
                ['slug' => $addon['slug']],
                array_merge($addon, ['is_active' => true])
            );
        }
    }
}
