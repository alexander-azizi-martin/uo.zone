<?php

namespace App\Console\Commands;

use Aws\SecretsManager\SecretsManagerClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class EnvAws extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'env:aws';

    /**
     * The console command description.
     */
    protected $description = 'Gets environment variables from aws secret';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $client = new SecretsManagerClient(['region' => 'ca-central-1']);
        $result = $client->getSecretValue([
            'SecretId' => 'prod/uozone/env',
        ]);
    
        $envContents = collect(json_decode($result['SecretString']))
            ->map(function (string $value, string $key) {
                return "$key=$value";
            })
            ->implode("\n");
    
        Storage::disk('root')->put('.env', $envContents);
    }
}
