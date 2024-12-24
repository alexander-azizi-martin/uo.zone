<?php

namespace Database\Seeders\Professor;

use App\Models\Professor\Professor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProfessorIdSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professors = json_decode(Storage::disk('static')->get('professor_public_ids.json'), true);

        foreach ($professors as $professorName => $professorId) {
            DB::table('professors')
                ->where('name', $professorName)
                ->update(['public_id' => $professorId]);
        }

        $nextId = collect($professors)->values()->max();
        foreach (Professor::whereNull('public_id')->cursor() as $professor) {
            $professor->update(['public_id' => ++$nextId]);
        }
    }
}
