<?php

namespace App\Providers;

use App\Models\Translations;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use Laravel\Scout\Builder;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

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
                    foreach ($item as $key => $value) {
                        if (is_array($value) && array_key_exists('translations', $value)) {
                            $item[$key] = new Translations($value['translations']);
                        }
                    }

                    $models->push(new $className($item));
                }

                return $models;
            });
        }
    }
}
