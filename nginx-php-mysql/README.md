## Compose sample application
### PHP server with an Nginx proxy and a MySQL database

Project structure:
```
.
├── backend
│   ├── index.php
├── db
│   └── password.txt
├── docker-compose.yaml
├── proxy
│   ├── conf
│   └── Dockerfile
└── README.md
```

[_docker-compose.yaml_](docker-compose.yaml)
```
services:
  backend:
    image: php:8.0.3-fpm-buster
    ...
  db:
    image: mysql:8.0.19
    ...
  proxy:
    build: proxy
    ports:
    - 80:80
    ...
```
The compose file defines an application with three services `proxy`, `backend` and `db`.
When deploying the application, docker-compose maps port 80 of the proxy service container to port 80 of the host as specified in the file.
Make sure port 80 on the host is not already in use.

## Deploy with docker-compose

```
$ docker-compose up -d
Creating nginx-php-mysql_db_1 ... done
Creating nginx-php-mysql_backend_1 ... done
Creating nginx-php-mysql_proxy_1   ... done
```

## Expected result

Listing containers must show three containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE                     COMMAND                  CREATED          STATUS          PORTS                 NAMES
2244050972fc   nginx-php-mysql_proxy     "/docker-entrypoint.…"   51 seconds ago   Up 49 seconds   0.0.0.0:80->80/tcp    nginx-php-mysql_proxy_1
75353040cb38   nginx-php-mysql_backend   "docker-php-entrypoi…"   51 seconds ago   Up 50 seconds   9000/tcp              nginx-php-mysql_backend_1
e54bd7e0c790   mysql:8.0.19              "docker-entrypoint.s…"   52 seconds ago   Up 50 seconds   3306/tcp, 33060/tcp   nginx-php-mysql_db_1
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```
$ curl localhost:80
<h1>hello world in php!</h1>
```

Stop and remove the containers
```
$ docker-compose down
```
