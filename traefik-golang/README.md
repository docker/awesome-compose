## Compose sample application

### Use with Docker Development Environments

You can open this sample in the Dev Environments feature of Docker Desktop version 4.12 or later.

[Open in Docker Dev Environments <img src="../open_in_new.svg" alt="Open in Docker Dev Environments" align="top"/>](https://open.docker.com/dashboard/dev-envs?url=https://github.com/docker/awesome-compose/tree/master/traefik-golang)

### TRAEFIK proxy with GO backend

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   └── main.go
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
```
services:
  frontend:
    image: traefik:2.6
    command: --providers.docker --entrypoints.web.address=:80 --providers.docker.exposedbydefault=false
    ports:
      # The HTTP port
      - "80:80"
    volumes:
      # So that Traefik can listen to the Docker events
      - /var/run/docker.sock:/var/run/docker.sock
    depends_on:
      - backend
  backend:
    build: backend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.go.rule=Path(`/`)"
      - "traefik.http.services.go.loadbalancer.server.port=80"

```
The compose file defines an application with two services `frontend` and `backend`.
When deploying the application, docker compose maps port 80 of the frontend service container to the same port of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

## Deploy with docker compose

```
$ docker compose up -d
Creating network "traefik-golang_default" with the default driver
Building backend
Step 1/7 : FROM golang:1.13 AS build
1.13: Pulling from library/golang
...
Successfully built 22397f6cd4bc
Successfully tagged traefik-golang_backend:latest
WARNING: Image for service backend was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Pulling frontend (traefik:2.6)...
2.6: Pulling from library/traefik
8663204ce13b: Pull complete
1a6b5dadc224: Pull complete
c7891231da41: Pull complete
9e3c91eff4e8: Pull complete
Digest: sha256:9dc508fe4f1516b81ec97ed37dd4f3b406f02eda72c7c0dcd9f74d23fbc82239
Status: Downloaded newer image for traefik:2.6
Creating traefik-golang_backend_1 ... done
Creating traefik-golang_frontend_1 ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS          PORTS                               NAMES
e0a0f3191042   traefik:2.6              "/entrypoint.sh --pr…"   42 seconds ago   Up 42 seconds   0.0.0.0:80->80/tcp, :::80->80/tcp   traefik-golang-frontend-1
662d1506f1fd   traefik-golang_backend   "/usr/local/bin/back…"   42 seconds ago   Up 42 seconds                                       traefik-golang-backend-1
```

After the application starts, navigate to `http://localhost:80` in your web browser or run:
```
$ curl localhost:80

          ##         .
    ## ## ##        ==
 ## ## ## ## ##    ===
/"""""""""""""""""\___/ ===
{                       /  ===-
\______ O           __/
 \    \         __/
  \____\_______/


Hello from Docker!
```

Stop and remove the containers
```
$ docker compose down
```
