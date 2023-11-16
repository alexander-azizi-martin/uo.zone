<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
            DROP FUNCTION IF EXISTS TS_NORMALIZE_SPELLING;

            CREATE FUNCTION TS_NORMALIZE_SPELLING(query_input text, lang text) 
            RETURNS text AS $$
                BEGIN
                    return (
                        WITH query_words(word) AS (SELECT UNNEST(string_to_array(lower(query_input), ' ')))
                        SELECT STRING_AGG(
                            CASE 
                                WHEN query_words.word ~ '^[A-Za-z]+$' THEN COALESCE (
                                    (
                                        SELECT word
                                        FROM ts_words 
                                        WHERE (
                                            (ts_words.language = lang or ts_words.language is NULL) AND 
                                            ts_words.word % query_words.word
                                        )
                                        ORDER BY similarity(ts_words.word, query_words.word) DESC LIMIT 1
                                    ),
                                    query_words.word
                                )
                                ELSE query_words.word
                            END,
                            ' '
                        )
                        FROM query_words
                        WHERE query_words.word != ''
                    );
                END;
            $$ LANGUAGE plpgsql;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS NORMALIZE_SPELLING;');
    }
};
