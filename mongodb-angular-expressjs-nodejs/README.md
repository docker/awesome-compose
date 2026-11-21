## Compose sample application

## Node.js application with Angular and  Nginx proxy and Mongodb database

Project structure:
```

mongodb-angular-expressjs-nodejs/
├── backend
│   ├── db
│   │   └── mongodb.js
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── compose.yaml
├── frontend
│   ├── angular.json
│   ├── Dockerfile
│   ├── karma.conf.js
│   ├── node_modules
│   ├── output.png
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── src
│   │   ├── app
│   │   │   ├── app.component.css
│   │   │   ├── app.component.html
│   │   │   ├── app.component.spec.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   └── app-routing.module.ts
│   │   ├── assets
│   │   ├── environments
│   │   │   ├── environment.prod.ts
│   │   │   └── environment.ts
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── polyfills.ts
│   │   ├── styles.css
│   │   └── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   └── tsconfig.spec.json
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
└── README.md

9 directories, 33 files


```
[_compose.yaml_](compose.yaml)
```
services:
  backend:
    restart: on-failure
    build: ./backend
    volumes:
      - ./backend:/usr/src/app
    hostname: backend
    container_name: backend
  mongo:
    restart: on-failure
    image: mongo
    ports:
      - '27017:27017'
    volumes:
      - /data/db
    hostname: mongo
    container_name: mongo
  nginx:
    build: ./nginx
    ports:
    - '80:80'
    depends_on:
    - backend
    - mongo
    hostname: nginx
    container_name: nginx

  frontend:
    build:
      context: frontend
      target: builder
    ports:
      - 4200:4200
    volumes:
      - ./frontend:/project
      - /project/node_modules
    hostname: frontend
    container_name: frontend





```
The compose file defines an application with tree services  `nginx`, `front` and `backend`.
When deploying the application, docker compose maps port 4200 of the nginx service container to port 4200 of the host as specified in the file.
also you can access to angular app on port 4200
and the mongoDB on port 27017


## Deploy with docker compose

```shell
 docker compose up -d
 [+] Running 4/0
 ⠿ Container backend   Created                                                                             0.0s
 ⠿ Container frontend  Created                                                                             0.0s
 ⠿ Container mongo     Created                                                                             0.0s
 ⠿ Container nginx     Created 

```

## Expected result

Listing containers must show three containers running and the port mapping as below:


```
docker-compose ps

CONTAINER ID   IMAGE                                       COMMAND                  CREATED         STATUS          PORTS                                                      NAMES
f7e46df7806f   mongodb-angular-expressjs-nodejs-nginx      "/docker-entrypoint.…"   5 minutes ago   Up 16 seconds   0.0.0.0:80->80/tcp                                         nginx
7cd374f14cba   mongodb-angular-expressjs-nodejs-backend    "docker-entrypoint.s…"   5 minutes ago   Up 17 seconds   5000/tcp                                                   backend
526c12817555   mongodb-angular-expressjs-nodejs-frontend   "docker-entrypoint.s…"   5 minutes ago   Up 17 seconds   0.0.0.0:4200->4200/tcp                                     frontend
1923a93dae8d   mongo                                       "docker-entrypoint.s…"   5 minutes ago   Up 17 seconds   0.0.0.0:27017->27017/tcp 
```

## Testing the app

1. After the application starts, navigate to 
`http://localhost:4200` 


2. Check the mongoDB connection with mongodb compass or mongo shell

```
mongosh "mongodb://localhost:27017"
```

3. Check the backend connection with postman or curl

```
curl http://localhost
```


## Stop and remove the containers

```
$ docker compose down
```


