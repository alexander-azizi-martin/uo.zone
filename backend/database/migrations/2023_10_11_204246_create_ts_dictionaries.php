<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            DROP TEXT SEARCH CONFIGURATION IF EXISTS english_ispell;
            CREATE TEXT SEARCH CONFIGURATION english_ispell ( 
                COPY = english 
            );

            DROP TEXT SEARCH CONFIGURATION IF EXISTS french_ispell;
            CREATE TEXT SEARCH CONFIGURATION french_ispell ( 
                COPY = french 
            );

            -- DROP TEXT SEARCH DICTIONARY IF EXISTS english_canada_ispell;
            -- CREATE TEXT SEARCH DICTIONARY english_canada_ispell (
            --    TEMPLATE = ispell,
            --    DictFile = en_ca,
            --    AffFile = en_ca,
            --    STOPWORDS = english
            -- );

            -- DROP TEXT SEARCH DICTIONARY IF EXISTS course_keywords;
            -- CREATE TEXT SEARCH DICTIONARY course_keywords (
            --    TEMPLATE = synonym,
            --    SYNONYMS = course_keywords
            -- );

            -- ALTER TEXT SEARCH CONFIGURATION english_ispell
            --    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part, numword, numhword, hword_numpart
            --    WITH course_keywords, english_canada_ispell, english_stem;

            -- ALTER TEXT SEARCH CONFIGURATION french_ispell
            --    ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part, numword, numhword, hword_numpart
            --    WITH course_keywords, french_france_ispell, french_stem;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('
            -- DROP TEXT SEARCH DICTIONARY IF EXISTS english_canada_ispell;
            -- DROP TEXT SEARCH DICTIONARY IF EXISTS course_keywords;
            DROP TEXT SEARCH CONFIGURATION IF EXISTS english_ispell;
            DROP TEXT SEARCH CONFIGURATION IF EXISTS french_ispell;
        ');
    }
};
