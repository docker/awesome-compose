# Compose sample application

## Django application with PostgreSQL support

Project structure:
```
.
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── manage.py
├── django_app
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

[docker-compose.yml](https://github.com/docker/awesome-compose/blob/master/django-postgres/docker-compose.yml)

```yaml
services:
  web:
    build: .
    ports:
      - 8000:8000
    depends_on:
      - db
  db:
    image: postgres:11
    ports:
      - 5432:5432

volumes:
  postgres_data:
```

## Changes in Django project
To make your Django project work with PostgreSQL, you need to add the following lines to your settings.py file:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': 'db',
        'PORT': 5432
    }
}
```

## Deploy with docker-compose
```
$ docker-compose up -d
[+] Building 27.5s (10/10) FINISHED
 => [internal] load build definition from Dockerfile  
 => => transferring dockerfile: 340B
 ...
 ...
 [+] Running 4/4
 ⠿ Network django-postgres_default         Created                                                                                                     0.1s
 ⠿ Volume "django-postgres_postgres_data"  Created                                                                                                     0.0s
 ⠿ Container django-postgres-db-1          Started                                                                                                     2.9s
 ⠿ Container django-postgres-web-1         Started
```


## Expected result
Listing containers must showtwo containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS               NAMES
9a3b782b1b5a   django-postgres_web   "python /code/manage…"   12 minutes ago   Up 12 minutes   0.0.0.0:8000->8000/tcp   django-postgres-web-1
de27369602f3   postgres:11           "docker-entrypoint.s…"   12 minutes ago   Up 12 minutes   0.0.0.0:5432->5432/tcp   django-postgres-db-1
```

After the application starts, navigate to ```http://localhost:8000``` in your web browser.

To stop and remove containers, run:
```
$ docker-compose down
```

