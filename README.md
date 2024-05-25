[![uo.zone](frontend/public/images/homepage.png)](https://uo.zone)
# UO Grades

[uo.zone](https://uo.zone) is a web app that allows you to look up past grades for courses at the University of Ottawa. 

## Tech Stack

The frontend is written in typescript using nextjs, shadcn ui, and tailwind css. 

The backend is written in php using laravel, sqlite, and meilisearch. 

Python and scrapy were used to scrape information from the University of Ottawa's website and [ratemyprofessors](ratemyprofessors.com).

# Acknowledgments

The idea for UO Grades was inspired by [Gopher Grades](https://umn.lol/) a similar website for the University of Minnesota, Twin Cities. The design and frontend for UO Grades was based off of the [Gopher Grades Github](https://github.com/samyok/gophergrades) with many of the React components being reimplemented.

# Running Locally

## Prerequisites

- [nodejs](https://nodejs.org/en)
- [docker](https://docs.docker.com/engine/install/)

## Backend
```bash
cd backend

# installs php composer dependencies
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php82-composer:latest \
    composer install --ignore-platform-reqs

cp .env.example .env

npm install
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan db:extract \
    --file=https://uozone.s3.ca-central-1.amazonaws.com/database.tar.xz
./vendor/bin/sail artisan scout:fresh

# live at http://localhost
```

## Frontend
```bash
cd frontend

cp .env.example .env.local

npm install
npm run dev

# live at http://localhost:3000
```
