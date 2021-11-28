## Compose sample application
### TRAEFIK proxy with GO backend

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   └── main.go
├── docker-compose.yml
└── README.md
```

[_docker-compose.yaml_](docker-compose.yaml)
```
version: "3.7"
services:
  frontend:
    image: traefik:2.2
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
When deploying the application, docker-compose maps port 80 of the frontend service container to the same port of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "traefik-golang_default" with the default driver
Building backend
Step 1/7 : FROM golang:1.13 AS build
1.13: Pulling from library/golang
...
Successfully built 22397f6cd4bc
Successfully tagged traefik-golang_backend:latest
WARNING: Image for service backend was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Pulling frontend (traefik:2.2)...
2.2: Pulling from library/traefik
aad63a933944: Pull complete
f365f1b91ebb: Pull complete
dc367a6045f5: Pull complete
ff697159d003: Pull complete
Digest: sha256:615483752426932469aa2229ef3f0825b33b3ad7e1326dcd388205cb3a74352e
Status: Downloaded newer image for traefik:2.2
Creating traefik-golang_backend_1 ... done
Creating traefik-golang_frontend_1 ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS  
              NAMES
e845f50da9e6        traefik:2.2              "/entrypoint.sh --pr…"   55 seconds ago      Up 54 seconds       0.0.0.0:80->80/tcp   traefik-golang_frontend_1
e164ffd692e8        traefik-golang_backend   "/usr/local/bin/back…"   55 seconds ago      Up 54 seconds
              traefik-golang_backend_1
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
$ docker-compose down
```
