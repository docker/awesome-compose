<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Config;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Config::updateOrCreate(
            ['key' => 'title'],
            ['value' => 'Docker Compose']
        );

        Config::updateOrCreate(
            ['key' => 'sub_title'],
            ['value' => 'React(Vite) + Laravel + MySQL']
        );
    }
}
