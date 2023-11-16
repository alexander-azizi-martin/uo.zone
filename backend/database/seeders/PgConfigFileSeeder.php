<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PgConfigFileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $files = Storage::files('tsearch_data');

        foreach ($files as $file) {
            $fileName = basename($file);
            $filePath = "/usr/share/postgresql/15/tsearch_data/$fileName";
            $fileData = Storage::get($file);

            DB::insert('
                INSERT INTO pg_config_files VALUES (:path, :data) ON CONFLICT (path) DO 
                    UPDATE SET data = :data;
            ', [
                'path' => $filePath,
                'data' => $fileData,
            ]);
        }
    }
}
