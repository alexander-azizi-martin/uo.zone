<?php

namespace App\Traits;

use App\Models\ViewCount;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasViews 
{
    /**
     * Increment the model's view count.
     */
    public function incrementViewCount(): void
    {
        $this->viewCount()->increment('views');
    }

    /**
     * Get the models's view count.
     */
    public function viewCount(): MorphOne
    {
        return $this->MorphOne(ViewCount::class, 'viewable');
    }
};
