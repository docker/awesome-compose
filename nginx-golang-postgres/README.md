## Compose sample application
### Go server with an Nginx proxy and a Postgres database

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   ├── go.mod
│   └── main.go
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
    build: backend
    ...
  db:
    image: postgres
    ...
  proxy:
    build: proxy
    ports:
    - 80:80
    ...
```
The compose file defines an application with three services `proxy`, `backend` and `db`.
When deploying the application, docker-compose maps port 80 of the proxy service container to port 80 of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "nginx-golang-postgres_default" with the default driver
Pulling db (postgres:)...
latest: Pulling from library/postgres
...
Successfully built 5f7c899f9b49
Successfully tagged nginx-golang-postgres_proxy:latest
WARNING: Image for service proxy was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating nginx-golang-postgres_db_1 ... done
Creating nginx-golang-postgres_backend_1 ... done
Creating nginx-golang-postgres_proxy_1   ... done
```

## Expected result

Listing containers must show three containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS              PORTS                NAMES
5e3ecd0289c0        nginx-golang-postgres_proxy     "nginx -g 'daemon of…"   48 seconds ago      Up 48 seconds       0.0.0.0:80->80/tcp   nginx-golang-postgres_proxy_1
ffa1410b1c8a        nginx-golang-postgres_backend   "/server"                49 seconds ago      Up 48 seconds       8000/tcp             nginx-golang-postgres_backend_1
e63be7db7cbc        postgres                        "docker-entrypoint.s…"   49 seconds ago      Up 49 seconds       5432/tcp             nginx-golang-postgres_db_1
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```
$ curl localhost:80
["Blog post #0","Blog post #1","Blog post #2","Blog post #3","Blog post #4"]
```

Stop and remove the containers
```
$ docker-compose down
```
