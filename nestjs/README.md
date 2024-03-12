## Compose sample application

### Use with Docker Development Environments

### NestJS

Project structure:

```
.
├── compose.yaml
├── README.md
└── app
    ├── Dockerfile
    └── ...
```

[_compose.yaml_](compose.yaml)

```
services:
  api:
    build:
      context: app
      target: production
    ports: # You should add the port you need to expose applicaiton if you change the default port
      - '3000:3000'
```

Make sure port 3000 on the host is not already being in use.
Make sure you have already add the port you need to expose applicaiton if you change the default port

## Deploy with docker compose

```
$ docker compose up -d
[+] Building 1.2s (18/19)
 => [internal] load build definition from Dockerfile
 => transferring dockerfile: 655B
...
[+] Running 1/1
 ⠿ Container nestjs-api-1  Started
```

## Expected result

Listing containers must show one container running and the port mapping as below:

```
$ docker ps
CONTAINER ID   IMAGE        COMMAND                  CREATED         STATUS                            PORTS                                       NAMES
7573c6f216ed   nestjs_api   "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes (health: starting)   0.0.0.0:3000->3000/tcp, :::3000->3000/tcp   nestjs-api-1
```

After the application starts, navigate to `http://localhost:3000` in your web browser. (if you didn't specify a port, the default port will be used.)

Stop and remove the containers

```
$ docker compose down
[+] Running 2/2
 ⠿ Container nestjs-api-1 Removed
 ⠿ Network nestjs_default  Removed
```
