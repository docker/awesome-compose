# Compose Sample Application

## NGINX Reverse Proxy -> WSGI -> Python/Django Backend + MySQL

Project structure:

```text
.
├── README.md
├── django
│   ├── Dockerfile
│   ├── requirements.txt
│   └── sample/
│       ├── manage.py
│       ├── requirements.txt
│       └── sample/
├── docker-compose.yaml
└── nginx
    ├── Dockerfile
    ├── default.conf
    ├── nginx.conf
    └── start.sh
```

[_docker-compose.yaml_](docker-compose.yaml)

```yml
version: "3.9"
services:
  
  nginx-proxy:
    build: nginx
    ports:
      - 80:80
    ...
  
  django-app:
    build: django
    container_name: django-app
    ports:
      - 8000:8000
    ...
  
  mysql:
    image: mysql:8.0.28
    container_name: mysql
    ports:
      - 3306:3306
    ...


```

The compose file defines an application with three services `nginx-proxy`, `django-app` and `mysql`.
When deploying the application, docker-compose maps port 80 of the web service container to port 80 of the host as specified in the file.

Make sure port 80 on the host is not being used by another container, otherwise the port should be changed.

## Deploy with docker-compose

```bash
$ docker-compose up -d
[+] Running 4/4
 ⠿ Network nginx-wsgi-django-mysql_default  Created
 ⠿ Container mysql                          Started
 ⠿ Container django-app                     Started
 ⠿ Container nginx-proxy                    Started
```

## Expected result

Listing containers must show three containers running and the port mapping as below:

```bash
CONTAINER ID   IMAGE          COMMAND                  CREATED             STATUS             PORTS                               NAMES
d80066a23885   some-nginx     "/docker-entrypoint.…"   About an hour ago   Up About an hour   0.0.0.0:80->80/tcp                  nginx-proxy
a30bb5db0798   mysql:8.0.28   "docker-entrypoint.s…"   About an hour ago   Up About an hour   0.0.0.0:3306->3306/tcp, 33060/tcp   mysql
7031de9c4531   some-django    "gunicorn -w 2 -b 0.…"   About an hour ago   Up About an hour   0.0.0.0:8000->8000/tcp              django-app
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:

```bash
$ curl localhost:80

<!doctype html>

<html lang="en-us" dir="ltr">
    <head>
        <meta charset="utf-8">
...
```

Stop and remove the containers

```bash
$ docker-compose down
[+] Running 4/4
 ⠿ Container nginx-proxy                    Removed
 ⠿ Container mysql                          Removed
 ⠿ Container django-app                     Removed
 ⠿ Network nginx-wsgi-django-mysql_default  Removed
```

## About

By following the steps above, you will have an NGINX Reverse Proxy and a Django backend. The general traffic flow will look like the following:

`Client -> NGINX -> WSGI -> Django + MySQL`

### NGINX

With this deployment model, we use NGINX to proxy and handle all requests to our Django backend. This is a powerful deployment model as we can use NGINX to cache responses or even act as an application load balancer between multiple Django backends. You could also integrate a Web Application Firewall into NGINX to protect your Django backend from attacks.

### WSGI

WSGI (Web Server Gateway Interface) is the interface that sits in between our NGINX proxy and Django backend. It is used to handle requests and interface with our backend. WSGI allows you to handle thousands of requests at a time and is highly scalable. In this `docker-compose` sample, we use Gunicorn for our WSGI.

### Django

Django is a web development framework written in Python. It is the "backend" which processes requests.
