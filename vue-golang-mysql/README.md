## Compose sample application

### Vue3 application with Go backend and mysql database

Project structure
```yaml
.
├── docker-compose.yml
├── README.md
├── server
└── web
```

[docker-compose.yml](docker-compose.yml)
```yaml
version: '3'
services:
  mydb:
    restart: always
    image: mysql:8.0
    ...
  server:
    build:
      context: ./server
    ...
  web:
    build:
      context: ./web
    ...
```


## Deploy with docker composeTech

```console
➜ sudo docker compose up -d
[+] Running 3/3
 ⠿ Container web Started 1.2s
 ⠿ Container mydb    Started 0.4s
 ⠿ Container server  Started 0.4s
```


## Expected result

Listing containers must show two containers running and the port mapping as below:
```console
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS         PORTS                                                  NAMES
2eed57a008a0   vue-golang-mysql-web      "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:80->3000/tcp, :::80->3000/tcp                  web
5bdbeda7b734   vue-golang-mysql-server   "./code-paste"           3 minutes ago   Up 3 minutes   0.0.0.0:8080->8080/tcp, :::8080->8080/tcp              server
d07aeb384642   mysql:8.0                 "docker-entrypoint.s…"   3 minutes ago   Up 3 minutes   0.0.0.0:3306->3306/tcp, :::3306->3306/tcp, 33060/tcp   mydb
```

After the application starts, navigate to http://localhost in your web browser to use app.

![](https://s1.ax1x.com/2022/09/03/voZz3q.png)

## Stop and remove the containers

```console
docker compose down
```