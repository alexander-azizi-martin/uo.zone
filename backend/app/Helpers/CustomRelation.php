<?php

namespace App\Helpers;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;

class CustomRelation extends Relation
{
    /**
     * Type of relation, either 'one' or 'many'.
     */
    protected string $type;

    /**
     * The baseConstraints callback.
     */
    protected \Closure $baseConstraints;

    /**
     * The eagerConstraints callback.
     */
    protected \Closure $eagerConstraints;

    /**
     * The eager constraints model matcher.
     */
    protected \Closure $eagerMatcher;

    /**
     * Create a new belongs to relationship instance.
     *
     * @return void
     */
    public function __construct(
        Builder $query,
        Model $parent,
        string $type,
        \Closure $baseConstraints,
        \Closure $eagerConstraints,
        \Closure $eagerMatcher
    ) {
        if (! in_array($type, ['one', 'many'])) {
            throw new \ValueError(
                "Expected 'type' argument to be one of ['one', 'many'] but got '{$type}'"
            );
        }

        $this->type = $type;
        $this->baseConstraints = \Closure::bind($baseConstraints, $this, CustomRelation::class);
        $this->eagerConstraints = \Closure::bind($eagerConstraints, $this, CustomRelation::class);
        $this->eagerMatcher = \Closure::bind($eagerMatcher, $this, CustomRelation::class);

        parent::__construct($query, $parent);
    }

    /**
     * Set the base constraints on the relation query.
     *
     * @return void
     */
    public function addConstraints()
    {
        if (static::$constraints) {
            call_user_func($this->baseConstraints);
        }
    }

    /**
     * Set the constraints for an eager load of the relation.
     *
     * @return void
     */
    public function addEagerConstraints(array $models)
    {
        call_user_func($this->eagerConstraints, $models);
    }

    /**
     * Initialize the relation on a set of models.
     *
     * @param  string  $relation
     * @return array
     */
    public function initRelation(array $models, $relation)
    {
        foreach ($models as $model) {
            $model->setRelation(
                $relation,
                $this->type === 'many' ? $this->related->newCollection() : null
            );
        }

        return $models;
    }

    /**
     * Match the eagerly loaded results to their parents.
     *
     * @param  string  $relation
     * @return array
     */
    public function match(array $models, Collection $results, $relation)
    {
        return call_user_func($this->eagerMatcher, $models, $results, $relation);
    }

    /**
     * Get the results of the relationship.
     *
     * @return mixed
     */
    public function getResults()
    {
        if ($this->type === 'one') {
            return $this->first();
        } else {
            return $this->get();
        }
    }

    /**
     * Execute the query as a "select" statement.
     *
     * @param  array  $columns
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function get($columns = ['*'])
    {
        // First we'll add the proper select columns onto the query so it is run with
        // the proper columns. Then, we will get the results and hydrate out pivot
        // models with the result of those columns as a separate model relation.
        $columns = $this->query->getQuery()->columns ? [] : $columns;

        if ($columns == ['*']) {
            $columns = [$this->related->getTable().'.*'];
        }

        $builder = $this->query->applyScopes();

        $models = $builder->addSelect($columns)->getModels();

        // If we actually found models we will also eager load any relationships that
        // have been specified as needing to be eager loaded. This will solve the
        // n + 1 query problem for the developer and also increase performance.
        if (count($models) > 0) {
            $models = $builder->eagerLoadRelations($models);
        }

        return $this->related->newCollection($models);
    }
}
