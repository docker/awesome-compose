<?php

use App\Models\Config;

Route::get('/config', function (Request $request) {
    $config = Config::where('key', ['title'])->first();

    return response()->json([
        'title' => $config->title
    ]);
});