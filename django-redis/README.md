## Compose sample application

### Python/Django application using a Redis database

## Project structure:

```
.
├── django_redis
│   ├── config/
│   │   └── settings.py
│   ├── database/
│   │   ├── migrations/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── asgi.py
│   ├── manage.py
│   └── wsgi.py
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── README.md
└── requirements.txt
```

The `.env` file should have the environment variables that are specified in the `.env.example` file.

[_docker-compose.yml_](docker-compose.yml)

```
services:
  redis:
    image: redislabs/redismod
    ports:
      - '6379:6379'
  web:
    build: .
    command: python django_redis/manage.py runserver 0.0.0.0:8000
    env_file:
      - .env
    ports:
      - '8000:8000'
    volumes:
      - .:/code
    depends_on:
      - redis
```

## Deploy with docker-compose

```
$ docker-compose up -d
[+] Running 2/2
 - Container djangoredis-redis-1  Started
 - Container djangoredis-web-1    Started
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```

$ docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED         STATUS          PORTS                    NAMES
384fcfc8a3d3   djangoredis_web      "python django_redis…"   2 minutes ago   Up 41 seconds   0.0.0.0:8000->8000/tcp   djangoredis-web-1
9b6c3ce8d394   redislabs/redismod   "redis-server --load…"   2 minutes ago   Up 44 seconds   0.0.0.0:6379->6379/tcp   djangoredis-redis-1
```

After the application starts, navigate to `http://localhost:8000/hello-redis` in your web browser or run:
```
$ curl localhost:8000/hello-redis
This page has been visited 5 times
```

## Stop and remove the containers
```
$ docker-compose down
[+] Running 3/3
 - Container djangoredis-web-1    Removed
 - Container djangoredis-redis-1  Removed
 - Network djangoredis_default    Removed
```
