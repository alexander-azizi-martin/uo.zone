<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Scout\Builder;

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

        if (! Builder::hasMacro('hydrate')) {
            /**
             * get() hydrates records by looking up the Ids in the corresponding database
             * This macro uses the data returned from the search results to hydrate
             *  the models and return a collection
             *
             * @return Collection
             */
            Builder::macro('hydrate', function () {
                $results = $this->engine()->search($this);
                $className = get_class($this->model);
                $models = new Collection();

                foreach ($results['hits'] as $item) {
                    $models->push(new $className($item));
                }

                return $models;
            });
        }
    }
}
