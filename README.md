[![uo.zone](frontend/public/images/homepage.png)](https://uo.zone)
# uoZone

uo.zone is a web app that allows you to look up past grades for courses at the University of Ottawa. The frontend is build with NextJS and Chakra UI. The backend is written in Laravel using a PostgreSQL database and redis cache. The data scrappers for scrapping data from the university website and [ratemyprofessors.com](https://www.ratemyprofessors.com/) are written in python using the scrapy library.

Web design and idea taken from [Gopher Grades](https://github.com/samyok/gophergrades).

# Running Locally

## Prerequisites

- [bun](https://bun.sh/)
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

./vendor/bin/sail artisan key:generate
./vendor/bin/sail up -d
./vendor/bin/sail artisan migrate

# live at http://localhost
```

## Frontend
```bash
cd frontend

cp .env.example .env.local

bun install
bun dev

# live at http://localhost:3000
```
