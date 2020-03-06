## Compose sample application
### Python/Flask with Nginx proxy and MySQL database

Project structure:
```
.
├── docker-compose.yaml
├── flask
│   ├── Dockerfile
│   ├── requirements.txt
│   └── server.py
└── nginx
    └── nginx.conf

```

[_docker-compose.yaml_](docker-compose.yaml)
```
services:
  backend:
    build: backend
    ...
  db:
    image: mysql:5.7
    ...
  proxy:
    build: proxy
    ...
```
The compose file defines an application with three services `proxy`, `backend` and `db`.
When deploying the application, docker-compose maps port 80 of the proxy service container to port 80 of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "nginx-flask-mysql_default" with the default driver
Pulling db (mysql:5.7)...
5.7: Pulling from library/mysql
...
...
WARNING: Image for service proxy was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating nginx-flask-mysql_db_1 ... done
Creating nginx-flask-mysql_backend_1 ... done
Creating nginx-flask-mysql_proxy_1   ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
c65ecef87e85        nginx-flask-mysql_proxy     "nginx -g 'daemon of…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp    nginx-flask-mysql_proxy_1
96ccc0a5342f        nginx-flask-mysql_backend   "/bin/sh -c 'flask r…"   About a minute ago   Up About a minute   5000/tcp              nginx-flask-mysql_backend_1
39327313a142        mysql:5.7                   "docker-entrypoint.s…"   About a minute ago   Up About a minute   3306/tcp, 33060/tcp   nginx-flask-mysql_db_1
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```
$ curl localhost:80
Hello world
```

Stop and remove the containers
```
$ docker-compose down
```
