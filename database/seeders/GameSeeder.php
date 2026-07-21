<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run(): void
    {
        $games = [
            ['name' => 'Racing Game', 'price' => 79999, 'category' => 'Racing Games', 'tech' => 'Flutter', 'downloads' => '12k+', 'delivery' => '7-10 days', 'mode' => 'Single Player', 'image_path' => '/img/car.webp', 'sort_order' => 1],
            ['name' => 'Puzzle Game', 'price' => 34999, 'category' => 'Puzzle Games', 'tech' => 'Unity', 'downloads' => '9k+', 'delivery' => '5-7 days', 'mode' => 'Single Player', 'image_path' => '/img/pzul.webp', 'sort_order' => 2],
            ['name' => 'Quiz Game', 'price' => 24999, 'category' => 'Quiz Games', 'tech' => 'Flutter', 'downloads' => '8k+', 'delivery' => '5-7 days', 'mode' => 'Single Player', 'image_path' => '/img/Quiz.webp', 'sort_order' => 3],
            ['name' => 'Ludo Game', 'price' => 59999, 'category' => 'Board Games', 'tech' => 'Unity', 'downloads' => '18k+', 'delivery' => '10-15 days', 'mode' => 'Multiplayer', 'image_path' => '/img/OIP.webp', 'sort_order' => 4],
            ['name' => 'Car Parking Game', 'price' => 69999, 'category' => 'Simulation Games', 'tech' => 'Unity', 'downloads' => '11k+', 'delivery' => '10-12 days', 'mode' => 'Single Player', 'image_path' => '/img/carim.jpg', 'sort_order' => 5],
            ['name' => 'Bike Racing', 'price' => 89999, 'category' => 'Racing Games', 'tech' => 'Unity', 'downloads' => '16k+', 'delivery' => '10-15 days', 'mode' => 'Single Player', 'image_path' => '/img/chas.webp', 'sort_order' => 6],
            ['name' => 'Fantasy Sports', 'price' => 149999, 'category' => 'Sports Games', 'tech' => 'Flutter', 'downloads' => '25k+', 'delivery' => '15-20 days', 'mode' => 'Multiplayer', 'image_path' => '/img/Fantasy%20Game.webp', 'sort_order' => 7],
            ['name' => 'Hyper Casual Game', 'price' => 19999, 'category' => 'Hyper Casual Games', 'tech' => 'Unity', 'downloads' => '6k+', 'delivery' => '4-6 days', 'mode' => 'Single Player', 'image_path' => '/img/Arrow%20pzul.webp', 'sort_order' => 8],
        ];

        foreach ($games as $game) {
            Game::updateOrCreate(
                ['name' => $game['name']],
                array_merge($game, ['is_active' => true, 'rating' => 5])
            );
        }
    }
}
