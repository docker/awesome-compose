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
    image: postgres
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
Creating network "react-express-mysql_default" with the default driver
Building backend
Step 1/16 : FROM node:10
 ---> aa6432763c11
...
Successfully tagged react-express-mysql_frontend:latest
WARNING: Image for service frontend was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
Creating react-express-mysql_db_1 ... done
Creating react-express-mysql_backend_1 ... done
Creating react-express-mysql_frontend_1 ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                           COMMAND                  CREATED             STATUS              PORTS                NAMES
5e3ecd0289c0        nginx-golang-postgres_proxy     "nginx -g 'daemon of…"   48 seconds ago      Up 48 seconds       0.0.0.0:80->80/tcp   nginx-golang-postgres_proxy_1
ffa1410b1c8a        nginx-golang-postgres_backend   "/server"                49 seconds ago      Up 48 seconds       8000/tcp             nginx-golang-postgres_backend_1
e63be7db7cbc        postgres                        "docker-entrypoint.s…"   49 seconds ago      Up 49 seconds       5432/tcp             nginx-golang-postgres_db_1
```

After the application starts, navigate to `http://localhost:80` in your web browser to get a colorful message.
```
My New React App
```

The backend service container has the port 80 mapped to 8080 on the host.
```
$ curl localhost:8080
Hello Docker World
```

Stop and remove the containers
```
$ docker-compose down
Stopping react-express-mysql_frontend_1 ... done
Stopping react-express-mysql_backend_1  ... done
Stopping react-express-mysql_db_1       ... done
Removing react-express-mysql_frontend_1 ... done
Removing react-express-mysql_backend_1  ... done
Removing react-express-mysql_db_1       ... done
Removing network react-express-mysql_default

```
