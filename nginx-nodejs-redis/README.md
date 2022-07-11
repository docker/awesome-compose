## Compose sample application

## Node.js application with Nginx proxy and Redis database

Project structure:
```
.
├── README.md
├── compose.yaml
├── proxy
│   └── nginx.conf
└── web
    ├── Dockerfile
    ├── package.json
    ├── package-lock.json
    └── server.js

2 directories, 7 files
```

[`compose.yaml`](compose.yaml)
```yaml
services:
  redis:
    image: 'redislabs/redismod'
    ports:
      - '6379:6379'
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  web1:
    build:
      context: web
      target: builder
    restart: on-failure
    hostname: web1
    depends_on:
      redis:
        condition: service_healthy

  web2:
    build:
      context: web
      target: builder
    restart: on-failure
    hostname: web2
    depends_on:
      redis:
        condition: service_healthy

  proxy:
    image: nginx
    volumes:
      - type: bind
        source: ./proxy/nginx.conf
        target: /etc/nginx/conf.d/default.conf
        read_only: true
    ports:
      - '80:80'
    depends_on:
      - web1
      - web2
```
The compose file defines an application with four services `redis`, `nginx`, `web1` and `web2`.
When deploying the application, docker compose maps port 80 of the nginx service container to port 80 of the host as specified in the file.


> ℹ️ **_INFO_**  
> Redis runs on port 6379 by default. Make sure port 6379 on the host is not being used by another container, otherwise the port should be changed.

## Deploy with docker compose

```
$ docker compose up -d
[+] Running 31/31
 ⠿ proxy Pulled                                                                              10.1s
 ⠿ redis Pulled                                                                              23.0s
[+] Building 1.1s (19/22)
 => [nginx-nodejs-redis_web1 internal] load build definition from Dockerfile                  0.0s
 => [nginx-nodejs-redis_web2 internal] load build definition from Dockerfile                  0.0s
 ...
 => [nginx-nodejs-redis_web1] exporting to image                                              0.0s
 => => exporting layers                                                                       0.0s
 => => writing image sha256:bb4ba7fc27bd0f7a8d572bc4ea9d0734b0f88f50a773b39028ffacd83c309c5c  0.0s
 => => naming to docker.io/library/nginx-nodejs-redis_web2                                    0.0s
 => => naming to docker.io/library/nginx-nodejs-redis_web1                                    0.0s
[+] Running 5/5
 ⠿ Network nginx-nodejs-redis_default    Created                                              0.0s
 ⠿ Container nginx-nodejs-redis-redis-1  Healthy                                             10.8s
 ⠿ Container nginx-nodejs-redis-web2-1   Started                                             11.2s
 ⠿ Container nginx-nodejs-redis-web1-1   Started                                             11.2s
 ⠿ Container nginx-nodejs-redis-proxy-1  Started                                             11.3s
```


## Expected result

Listing containers should show three containers running and the port mapping as below:

```shell
$ docker compose ps
NAME                         COMMAND                  SERVICE             STATUS              PORTS
nginx-nodejs-redis-proxy-1   "/docker-entrypoint.…"   proxy               running             0.0.0.0:80->80/tcp
nginx-nodejs-redis-redis-1   "redis-server --load…"   redis               running (healthy)   0.0.0.0:6379->6379/tcp
nginx-nodejs-redis-web1-1    "docker-entrypoint.s…"   web1                running
nginx-nodejs-redis-web2-1    "docker-entrypoint.s…"   web2                running
```

## Testing the app

After the application starts, navigate to `http://localhost:80` in your web browser or run:

```shell
$ curl localhost:80
web1: Total number of visits is: 1

$ curl localhost:80
web1: Total number of visits is: 2

$ curl localhost:80
web2: Total number of visits is: 3
```

## Stop and remove the containers

```shell
$ docker compose down
```

## Use with Docker Development Environments

You can use this sample with the Dev Environments feature of Docker Desktop.

![Screenshot of creating a Dev Environment in Docker Desktop](../dev-envs.png)

To develop directly on the services inside containers, use the HTTPS Git url of the sample:
```
https://github.com/docker/awesome-compose/tree/master/nginx-nodejs-redis
```
