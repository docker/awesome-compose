<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Config;

Route::get('/config', function (Request $request) {
    $config = Config::whereIn('key', ['title', 'sub_title'])
                    ->pluck('value', 'key')
                    ->toArray();

    return response()->json([
        'title' => $config['title'],
        'subTitle' => $config['sub_title'],
    ]);
});
