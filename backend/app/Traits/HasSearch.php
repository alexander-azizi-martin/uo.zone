<?php

namespace App\Traits;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

trait HasSearch
{
    /**
     * Search for matching models.
     */
    public static function search(string $query, array $columns = ['*'])
    {
        $table = app(static::class)->getTable();
        $select = Arr::join($columns, ',');

        $tokens = str($query)->trim()->limit(255, '')->explode(' ')->filter();
        if ($tokens->isEmpty()) {
            return static::query()->whereRaw('1 = 0');
        }

        $lastToken = $tokens->pop();
        $otherTokens = $tokens->implode(' ');

        $results = DB::select("
            WITH queries (query) as (
                SELECT ts_rewrite(
                (
                    COALESCE(plainto_tsquery('english_ispell', (select TS_NORMALIZE_SPELLING(:query, 'en'))), '') && 
                    (to_tsquery('english_ispell', (select TS_NORMALIZE_SPELLING(:lastWord, 'en'))) || to_tsquery('english_ispell', :lastWord || ':*'))
                ) || 
                (
                    COALESCE(plainto_tsquery('french_ispell', (select TS_NORMALIZE_SPELLING(:query, 'fr'))), '') && 
                    (to_tsquery('french_ispell', (select TS_NORMALIZE_SPELLING(:lastWord, 'fr'))) || to_tsquery('french_ispell', :lastWord || ':*'))
                ), 'SELECT t, s FROM ts_synonyms')
            )
            SELECT $select FROM $table, queries
            WHERE searchable_text @@ query
            ORDER BY log(total_enrolled + 1)
            LIMIT 10;
        ", ['query' => $otherTokens, 'lastWord' => $lastToken]);

        return static::hydrate($results);
    }
};
