## Compose sample application
### React application with a NodeJS backend and a MySQL database

Project structure:
```
.
├── backend
│   ├── Dockerfile
│   ...
├── db
│   └── password.txt
├── docker-compose.yaml
├── frontend
│   ├── ...
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
    image: mysql:5.7
    ...
  frontend:
    build: frontend
    ports:
    - 80:9000
    ...
```
The compose file defines an application with three services `frontend`, `backend` and `db`.
When deploying the application, docker-compose maps port 80 of the frontend service container to port 9000 of the host as specified in the file.
Make sure port 80 on the host is not already being in use.

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "react-java-mysql_default" with the default driver
Building backend
Step 1/10 : FROM maven:3.5-jdk-9 AS build
...
Successfully tagged react-java-mysql_frontend:latest
WARNING: Image for service frontend was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating react-java-mysql_frontend_1 ... done
Creating react-java-mysql_db_1       ... done
Creating react-java-mysql_backend_1  ... done
```

## Expected result

Listing containers must show three containers running and the port mapping as below:
```
$ docker ps
ONTAINER ID        IMAGE                       COMMAND                  CREATED             STATUS              PORTS                  NAMES
a63dee74d79e        react-java-mysql_backend    "java -Djava.securit…"   39 seconds ago      Up 37 seconds                              react-java-mysql_backend_1
6a7364c0812e        react-java-mysql_frontend   "docker-entrypoint.s…"   39 seconds ago      Up 33 seconds       0.0.0.0:80->9000/tcp   react-java-mysql_frontend_1
b176b18fbec4        mysql:5.7                   "docker-entrypoint.s…"   39 seconds ago      Up 37 seconds       3306/tcp, 33060/tcp    react-java-mysql_db_1
```

After the application starts, navigate to `http://localhost:80` in your web browser to get a colorful message.
```
My New React App
```

Stop and remove the containers
```
$ docker-compose down
Stopping react-java-mysql_backend_1  ... done
Stopping react-java-mysql_frontend_1 ... done
Stopping react-java-mysql_db_1       ... done
Removing react-java-mysql_backend_1  ... done
Removing react-java-mysql_frontend_1 ... done
Removing react-java-mysql_db_1       ... done
Removing network react-java-mysql_default
```
