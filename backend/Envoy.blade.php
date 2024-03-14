@servers(['web' => ['production']])

@task('deploy')
    cd uo.zone/backend

    git pull origin HEAD

    ./vendor/bin/sail artisan db:extract --s3 \
        && ./vendor/bin/sail artisan scout:fresh \
        && ./vendor/bin/sail restart
@endtask
