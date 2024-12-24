<?php

namespace App\Providers;

use Illuminate\Support\Arr;
use Illuminate\Support\ServiceProvider;
use League\StatsD\Client as Statsd;

class StatsdServiceProvider extends ServiceProvider
{
    /**
     * Register the service provider.
     */
    public function register()
    {
        $this->app->singleton(Statsd::class, function () {
            $options = Arr::only(
                config('services.statsd'),
                ['host', 'port', 'namespace', 'timeout', 'throwConnectionExceptions']
            );

            return (new Statsd())->configure($options);
        });
    }

    /**
     * Boot the service provider.
     */
    public function boot()
    {
    }
}
