## Compose sample application
### Go server with a Nginx proxy and a Postgres database

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   └── main.go
├── db
│   └── password.txt
├── compose.yaml
├── proxy
│   └── nginx.conf
└── README.md
```

[_compose.yaml_](compose.yaml)
```shell
services:
  backend:
    build:
      context: backend
      target: builder
    ...
  db:
    image: postgres
    ...
  proxy:
    image: nginx
    volumes:
      - type: bind
        source: ./proxy/nginx.conf
        target: /etc/nginx/conf.d/default.conf
        read_only: true
    ports:
      - 80:80
    ...
```
The compose file defines an application with three services `proxy`, `backend` and `db`.
When deploying the application, docker compose maps port 80 of the proxy service container to port 80 of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

## Deploy with docker compose

```shell
$ docker compose up -d
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
```shell
$ docker compose ps
NAME                              COMMAND                  SERVICE             STATUS              PORTS
nginx-golang-postgres-backend-1   "/code/bin/backend"      backend             running
nginx-golang-postgres-db-1        "docker-entrypoint.s…"   db                  running (healthy)   5432/tcp
nginx-golang-postgres-proxy-1     "/docker-entrypoint.…"   proxy               running             0.0.0.0:80->80/tcp
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```shell
$ curl localhost:80
["Blog post #0","Blog post #1","Blog post #2","Blog post #3","Blog post #4"]
```

Stop and remove the containers
```shell
$ docker compose down
```
