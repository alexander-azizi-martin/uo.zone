<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\Console\Output\ConsoleOutput;

trait HasSearch
{
    /**
     * Get the searchable data for the model.
     */
    public static function searchableColumns(): array
    {
        return Schema::getColumnListing(app(static::class)->getTable());
    }

    /**
     * Search for matching models.
     */
    public static function search(string $query): Builder
    {
        $searchable = static::searchableColumns();

        $queryBuilder = static::query();
        foreach ($searchable as $i => $column) {
            if ($i == 0) 
                $queryBuilder->where($column, 'ILIKE', '%' . $query . '%');
            else 
                $queryBuilder->orWhere($column, 'ILIKE', '%' . $query . '%');
        }

        return $queryBuilder;
    }
};
