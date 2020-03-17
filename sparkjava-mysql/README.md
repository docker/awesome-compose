## Compose sample application
### Java Spark application with MySQL database

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   └── ...
├── db
│   └── password.txt
├── docker-compose.yaml
└── README.md

```

[_docker-compose.yaml_](docker-compose.yaml)
```
version: "3.7"
services:
  backend:
    build: backend
    ports:
    - 8080:8080
  db:
    image: mysql:8.0.19
    ...
```
The compose file defines an application with two services `backend` and `db`.
When deploying the application, docker-compose maps port 8080 of the backend service container to port 80 of the host as specified in the file.
Make sure port 8080 on the host is not already being in use.

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "sparkjava-mysql_default" with the default driver
Building backend
...
Successfully tagged sparkjava-mysql_backend:latest
WARNING: Image for service backend was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating sparkjava-mysql_db_1      ... done
Creating sparkjava-mysql_backend_1 ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS              PORTS                  NAMES
ee1e4f05d9f6        sparkjava-mysql_backend   "/bin/sh -c 'java -j…"   44 seconds ago      Up 43 seconds       0.0.0.0:8080->8080/tcp   sparkjava-mysql_backend_1
716025ddf65b        mysql:8.0.19              "docker-entrypoint.s…"   44 seconds ago      Up 43 seconds       3306/tcp, 33060/tcp    sparkjava-mysql_db_1
```

After the application starts, run:
```
$ curl localhost:8080
["Blog post #0","Blog post #1","Blog post #2","Blog post #3","Blog post #4"]
```

Stop and remove the containers
```
$ docker-compose down
Stopping sparkjava-mysql_backend_1 ... done
Stopping sparkjava-mysql_db_1      ... done
Removing sparkjava-mysql_backend_1 ... done
Removing sparkjava-mysql_db_1      ... done
Removing network sparkjava-mysql_default
```
