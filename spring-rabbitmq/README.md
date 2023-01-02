## Compose sample application

### Java application with Spring framework and Rabbitmq

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   └── ...
├── compose.yaml
└── README.md

```

[_compose.yaml_](compose.yaml)
```
services:
  backend:
    build: backend
    ports:
    - 8080:8080
  rabbitmq:
    image: rabbitmq
    rabbitmq:3.9-management
    ...
```
The compose file defines an application with two services `backend` and `rabbitmq`.
When deploying the application, docker compose maps port 8080 of the backend service container to port 8080 of the host as specified in the file.
Make sure port 8080 on the host is not already being in use.

## Deploy with docker compose

```
$ docker compose up -d
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE                     COMMAND                  CREATED         STATUS         PORTS                                                 NAMES
86f6bb2a1585   spring-rabbitmq-backend   "java -cp app:app/li…"   6 minutes ago   Up 6 minutes   0.0.0.0:8080->8080/tcp                                spring-rabbitmq-backend-1
0c4522d3f075   rabbitmq                  "docker-entrypoint.s…"   6 minutes ago   Up 6 minutes   4369/tcp, 5671-5672/tcp, 15691-15692/tcp, 25672/tcp   spring-rabbitmq-rabbitmq-1
```

After the application starts, you can send and receive data to rabbitmq with this api :

`POST`: http://localhost:8080/sendMessage

Body:
```
{
    "title":""Hello, rabbitmq",
    "text":"This is my test messag",
    "sender":"admin"
}
```

`GET`: http://localhost:8080/getMessage

