<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\support\Facades\DB;

class TsWordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement("
            INSERT INTO ts_words
            (
                WITH all_words (word) as (
                    SELECT UNNEST(string_to_array(title, ' ')), language from courses
                )
                SELECT lower(word), language FROM all_words
                WHERE word ~ '^[A-Za-z]+$'
                EXCEPT 
                SELECT word, language FROM ts_words
            );
        ");
    }
}
