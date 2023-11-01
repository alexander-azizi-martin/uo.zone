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
        $this->registerStatsD();
    }

    /**
     * Boot the service provider.
     */
    public function boot()
    {
    }

    /**
     * Register Statsd
     *
     * @return void
     */
    protected function registerStatsD()
    {
        $this->app->singleton(Statsd::class, function ($app) {
            $options = Arr::only(
                config('statsd'),
                ['host', 'port', 'namespace', 'timeout', 'throwConnectionExceptions']
            );

            return (new Statsd())->configure($options);
        });
    }
}
