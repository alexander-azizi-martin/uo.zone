<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::shouldBeStrict();
        JsonResource::withoutWrapping();

        RateLimiter::for('api', function (Request $request) {
            // 50 requests per 10s
            return new Limit($request->ip(), 50, 10);
        });

        RateLimiter::for('list-all', function (Request $request) {
            // 5 requests per 1min
            return Limit::perMinute(5)->by($request->ip());
        });

        Gate::define('viewApiDocs', fn ($_ = null) => true);
    }
}
