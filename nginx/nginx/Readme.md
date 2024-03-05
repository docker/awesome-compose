


## Compose sample application

### Use with Docker Development Environments

You can open this sample in the Dev Environments feature of Docker Desktop version 4.12 or later.

[Open in Docker Dev Environments <img src="../open_in_new.svg" alt="Open in Docker Dev Environments" align="top"/>](https://open.docker.com/dashboard/dev-envs?url=https://github.com/docker/awesome-compose/tree/master/nginx-golang-mysql)

### Simple Nginx HTTP Server

Project structure:

```
│  docker-compose.yml
│  Readme.md
│
└─nginx
    │  Dockerfile
    │
    ├─conf.d
    │      default.conf
    │
    └─html
            index.html
```

[_compose.yaml_](compose.yaml)
```yaml
version: "3"

services:
  nginx:
    container_name: nginx
    build:
      ./nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/html:/usr/share/nginx/html
      - ./nginx/conf.d:/etc/nginx/conf.d
```


## Deploy with docker compose

```shell
$ docker compose up -d
[+] Running 2/0
 ✔ Network nginx_default  Created                                                                                  0.0s
 ✔ Container nginx        Created                                                                                  0.0s
Attaching to nginx
nginx  | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
nginx  | /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
nginx  | /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
nginx  | 10-listen-on-ipv6-by-default.sh: info: Getting the checksum of /etc/nginx/conf.d/default.conf
nginx  | 10-listen-on-ipv6-by-default.sh: info: /etc/nginx/conf.d/default.conf differs from the packaged version
nginx  | /docker-entrypoint.sh: Launching /docker-entrypoint.d/20-envsubst-on-templates.sh
nginx  | /docker-entrypoint.sh: Launching /docker-entrypoint.d/30-tune-worker-processes.sh
nginx  | /docker-entrypoint.sh: Configuration complete; ready for start up
nginx  | 2023/05/15 09:19:08 [notice] 1#1: using the "epoll" event method
nginx  | 2023/05/15 09:19:08 [notice] 1#1: nginx/1.23.4
nginx  | 2023/05/15 09:19:08 [notice] 1#1: built by gcc 10.2.1 20210110 (Debian 10.2.1-6)
nginx  | 2023/05/15 09:19:08 [notice] 1#1: OS: Linux 5.15.90.1-microsoft-standard-WSL2
nginx  | 2023/05/15 09:19:08 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker processes
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 28
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 29
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 30
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 31
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 32
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 33
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 34
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 35
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 36
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 37
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 38
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 39
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 40
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 41
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 42
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 43
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 44
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 45
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 46
nginx  | 2023/05/15 09:19:08 [notice] 1#1: start worker process 47
```


## URL

http://localhost/index.html


## Expected result

Listing containers must show three containers running and the port mapping as below:
```shell
$ docker compose ps
NAME                           COMMAND                  SERVICE             STATUS              PORTS
nginx-golang-mysql-backend-1   "/code/bin/backend"      backend             running
nginx-golang-mysql-db-1        "docker-entrypoint.s…"   db                  running (healthy)   3306/tcp
nginx-golang-mysql-proxy-1     "/docker-entrypoint.…"   proxy               running             0.0.0.0:80->80/tcp
l_db_1
```

After the application starts, navigate to `http://localhost/index.html` in your web browser or run:

Stop and remove the containers
```shell
$ docker compose down -v
```


