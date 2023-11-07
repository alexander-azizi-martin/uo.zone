<?php

use Aws\SecretsManager\SecretsManagerClient;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your Closure based console
| commands. Each Closure is bound to a command instance allowing a
| simple approach to interacting with each command's IO methods.
|
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('env:aws', function () {
    $client = new SecretsManagerClient(['region' => 'ca-central-1']);
    $result = $client->getSecretValue([
        'SecretId' => 'prod/uozone/env',
    ]);

    $envContents = collect(json_decode($result['SecretString']))
        ->map(function (string $key, string $value) {
            return "$key=$value\n";
        })
        ->sum();

    Storage::disk('root')->put('.env', $envContents);
});
