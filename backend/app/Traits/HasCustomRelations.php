<?php

namespace App\Traits;

use App\Helpers\CustomRelation;
use App\Models\CourseSection\CourseSection;
use App\Models\CourseSection\Grades;
use App\Models\CourseSection\SurveyResponse;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

trait HasCustomRelations
{
    /**
     * Define a custom relationship.
     */
    public function customHasOne($related, \Closure $baseConstraints, ?\Closure $eagerConstraints = null, ?\Closure $eagerMatcher = null)
    {
        $instance = new $related;
        $query = $instance->newQuery();

        return new CustomRelation($query, $this, 'one', $baseConstraints, $eagerConstraints, $eagerMatcher);
    }

    /**
     * Define a custom relationship.
     */
    public function customHasMany($related, \Closure $baseConstraints, ?\Closure $eagerConstraints = null, ?\Closure $eagerMatcher = null): CustomRelation
    {
        $instance = new $related;
        $query = $instance->newQuery();

        return new CustomRelation($query, $this, 'many', $baseConstraints, $eagerConstraints, $eagerMatcher);
    }

    public function hasGrades(string $joinTable = 'course_sections', bool $includeCovid = false): CustomRelation
    {
        $localKey = $this->getKeyName();
        $foreignKey = Str::singular($this->getTable())."_$localKey";
        $joinTableKey = $joinTable !== 'course_sections' ? 'course_section_id' : 'id';

        $gradeColumns = collect(Grades::GRADE_VALUES)->keys()
            ->map(fn ($column) => "SUM(`$column`) AS '$column'")
            ->implode(',');

        return $this->customHasOne(
            Grades::class,
            function () use ($joinTable, $joinTableKey, $localKey, $foreignKey, $gradeColumns, $includeCovid) {
                $this->getQuery()
                    ->selectRaw($gradeColumns)
                    ->join(
                        $joinTable,
                        'course_section_grades.course_section_id',
                        '=',
                        "$joinTable.$joinTableKey"
                    )
                    ->where("$joinTable.$foreignKey", $this->parent->{$localKey});

                if (! $includeCovid) {
                    // Joining course_sections table since term_id needs to be accessed
                    if ($joinTable !== 'course_sections') {
                        $this->getQuery()
                            ->join(
                                'course_sections',
                                'course_section_grades.course_section_id',
                                '=',
                                'course_sections.id',
                            );
                    }

                    $this->getQuery()->whereNotBetween(
                        'term_id',
                        [CourseSection::COVID_START, CourseSection::COVID_END],
                    );
                }
            },
            function (array $models) use ($joinTable, $joinTableKey, $localKey, $foreignKey, $gradeColumns, $includeCovid) {
                $this->getQuery()
                    ->selectRaw($gradeColumns)
                    ->addSelect("$joinTable.$foreignKey")
                    ->join(
                        $joinTable,
                        'course_section_grades.course_section_id',
                        '=',
                        "$joinTable.$joinTableKey"
                    )
                    ->groupBy("$joinTable.$foreignKey");

                $this->whereInEager(
                    $this->whereInMethod($this->parent, $localKey),
                    $foreignKey,
                    $this->getKeys($models, $localKey),
                    $this->getRelationQuery(),
                );

                if (! $includeCovid) {
                    // Joining course_sections table since term_id needs to be accessed
                    if ($joinTable !== 'course_sections') {
                        $this->getQuery()
                            ->join(
                                'course_sections',
                                'course_section_grades.course_section_id',
                                '=',
                                'course_sections.id',
                            );
                    }

                    $this->getQuery()->whereNotBetween(
                        'term_id',
                        [CourseSection::COVID_START, CourseSection::COVID_END],
                    );
                }
            },
            function (array $models, Collection $results, string $relationName) use ($localKey, $foreignKey) {
                $dictionary = $results->keyBy($foreignKey);

                foreach ($models as $model) {
                    if ($dictionary->has($model->{$localKey})) {
                        $model->setRelation(
                            $relationName,
                            $dictionary[$model->{$localKey}],
                        );
                    }
                }

                return $models;
            }
        );
    }

    public function hasSurveyResponses(string $questionType, string $joinTable = 'course_sections'): CustomRelation
    {
        $optionsColumns = collect(['A', 'B', 'C', 'D', 'E', 'F'])
            ->map(fn ($column) => "SUM(`$column`) AS '$column'")
            ->concat(['question', 'options'])
            ->implode(',');

        $localKey = $this->getKeyName();
        $foreignKey = Str::singular($this->getTable())."_$localKey";
        $joinTableKey = $joinTable !== 'course_sections' ? 'course_section_id' : 'id';

        return $this->customHasMany(
            SurveyResponse::class,
            function () use ($joinTable, $joinTableKey, $localKey, $foreignKey, $optionsColumns, $questionType) {
                $this->getQuery()
                    ->selectRaw($optionsColumns)
                    ->join(
                        $joinTable,
                        'course_section_survey_responses.course_section_id',
                        '=',
                        "$joinTable.$joinTableKey"
                    )
                    ->where('question_type', $questionType)
                    ->where("$joinTable.$foreignKey", $this->parent->{$localKey})
                    ->groupBy('question');
            },
            function (array $models) use ($joinTable, $joinTableKey, $localKey, $foreignKey, $optionsColumns, $questionType) {
                $this->getQuery()
                    ->selectRaw($optionsColumns)
                    ->addSelect("$joinTable.$foreignKey")
                    ->join(
                        $joinTable,
                        'course_section_survey_responses.course_section_id',
                        '=',
                        "$joinTable.$joinTableKey"
                    )
                    ->where('question_type', $questionType)
                    ->groupBy(["$joinTable.$foreignKey", 'question']);

                $this->whereInEager(
                    $this->whereInMethod($this->parent, $localKey),
                    $foreignKey,
                    $this->getKeys($models, $localKey),
                    $this->getRelationQuery(),
                );
            },
            function (array $models, Collection $results, string $relationName) use ($localKey, $foreignKey) {
                $dictionary = $results->groupBy($foreignKey);

                foreach ($models as $model) {
                    if ($dictionary->has($model->{$localKey})) {
                        $model->setRelation(
                            $relationName,
                            $dictionary[$model->{$localKey}],
                        );
                    }
                }

                return $models;
            }
        );
    }
}
