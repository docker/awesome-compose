## Compose sample application
### Python/Flask with Nginx proxy and MySQL database

Project structure:
```
.
├── compose.yaml
├── flask
│   ├── Dockerfile
│   ├── requirements.txt
│   └── server.py
└── nginx
    └── nginx.conf

```

[_compose.yaml_](compose.yaml)
```
services:
  backend:
    build: backend
    ...
  db:
    # We use a mariadb image which supports both amd64 & arm64 architecture
    image: mariadb:10.6.4-focal
    # If you really want to use MySQL, uncomment the following line
    #image: mysql:8.0.27
    ...
  proxy:
    build: proxy
    ...
```
The compose file defines an application with three services `proxy`, `backend` and `db`.
When deploying the application, docker compose maps port 80 of the proxy service container to port 80 of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

> ℹ️ **_INFO_**  
> For compatibility purpose between `AMD64` and `ARM64` architecture, we use a MariaDB as database instead of MySQL.  
> You still can use the MySQL image by uncommenting the following line in the Compose file   
> `#image: mysql:8.0.27`

## Deploy with docker compose

```
$ docker compose up -d
Creating network "nginx-flask-mysql_default" with the default driver
Pulling db (mysql:8.0.19)...
5.7: Pulling from library/mysql
...
...
WARNING: Image for service proxy was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating nginx-flask-mysql_db_1 ... done
Creating nginx-flask-mysql_backend_1 ... done
Creating nginx-flask-mysql_proxy_1   ... done
```

## Expected result

Listing containers must show three containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS                    NAMES
c2c703b66b19        nginx-flask-mysql_proxy     "nginx -g 'daemon of…"   39 seconds ago      Up 38 seconds       0.0.0.0:80->80/tcp     nginx-flask-mysql_proxy_1
2b8a21508c3c        nginx-flask-mysql_backend   "/bin/sh -c 'flask r…"   9 minutes ago       Up 38 seconds       0.0.0.0:5000->5000/tcp   nginx-flask-mysql_backend_1
0e6a96ea2028        mysql:8.0.19                "docker-entrypoint.s…"   9 minutes ago       Up 38 seconds       3306/tcp, 33060/tcp      nginx-flask-mysql_db_1


```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```
$ curl localhost:80
<div>Blog post #1</div><div>Blog post #2</div><div>Blog post #3</div><div>Blog post #4</div>
```

Stop and remove the containers
```
$ docker compose down
```
