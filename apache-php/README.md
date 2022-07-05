## Compose sample application
### PHP application with Apache2

Project structure:
```
.
├── compose.yaml
├── app
    ├── Dockerfile
    └── index.php

```

[_compose.yaml_](compose.yaml)
```
services:
  web:
    build: app
    ports: 
      - '80:80'
    volumes:
      - ./app:/var/www/html/
```

## Deploy with docker compose

```
$ docker compose up -d
Creating network "php-docker_web" with the default driver
Building web
Step 1/6 : FROM php:7.2-apache
...
...
Creating php-docker_web_1 ... done

```

## Expected result

Listing containers must show one container running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                  NAMES
2bc8271fee81        php-docker_web               "docker-php-entrypoi…"   About a minute ago  Up About a minute   0.0.0.0:80->80/tc    php-docker_web_1
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```
$ curl localhost:80
Hello World!
```

Stop and remove the containers
```
$ docker compose down
```

## Use with Docker Development Environments

You can use this sample with the Dev Environments feature of Docker Desktop.

![Screenshot of creating a Dev Environment in Docker Desktop](../dev-envs.png)

To develop directly on the services inside containers, use the HTTPS Git url of the sample:
```
https://github.com/docker/awesome-compose/tree/master/apache-php
```
