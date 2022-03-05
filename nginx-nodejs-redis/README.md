## Compose sample application

### Node.js application with Nginx proxy and a Redis database

Project structure:
```
.
├── docker-compose.yml
├── nginx
│   ├── Dockerfile
│   └── nginx.conf
├── web
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── web1
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
└── web2
    ├── Dockerfile
    ├── package.json
    └── server.js

4 directories, 12 files
```

[_docker-compose.yaml_](docker-compose.yaml)
```
version: '3.9'
services:
  redis:
    image: 'redis:alpine'
    ports:
      - '6379:6379'
  web1:
    restart: on-failure
    build: ./web1
    ports:
      - '81:5000'
  web2:
    restart: on-failure
    build: ./web2
    ports:
      - '82:5000'
  nginx:
    build: ./nginx
    ports:
    - '80:80'
    depends_on:
    - web1
    - web2
```
The compose file defines an application with four services `redis`, `web`, `web1` and `web2`.
When deploying the application, docker-compose maps port 80 of the web service container to port 80 of the host as specified in the file.
Redis runs on default port 6379. Make sure port 6379 on the host is not being used by another container, otherwise the port should be changed.

## Deploy with docker-compose

```
$ docker-compose up -d
```
```
Creating nginx-nodejs-redis_redis_1 ... done
Creating nginx-nodejs-redis_web1_1  ... done
Creating nginx-nodejs-redis_web2_1  ... done
Creating nginx-nodejs-redis_nginx_1 ... done
```


## Expected result

Listing containers must show three containers running and the port mapping as below:


```
docker-compose ps
           Name                        Command              State           Ports         
------------------------------------------------------------------------------------------
nginx-nodejs-redis_nginx_1   /docker-entrypoint.sh ngin     Up      0.0.0.0:80->80/tcp    
                             ...                                                          
nginx-nodejs-redis_redis_1   docker-entrypoint.sh redis     Up      0.0.0.0:6379->6379/tcp
                             ...                                                          
nginx-nodejs-redis_web1_1    docker-entrypoint.sh npm       Up      0.0.0.0:81->5000/tcp  
                             start                                                        
nginx-nodejs-redis_web2_1    docker-entrypoint.sh npm       Up      0.0.0.0:82->5000/tcp  
                             start   
```

## Testing the app

After the application starts, navigate to `http://localhost:80` in your web browser or run:

```
curl localhost:80
curl localhost:80
web1: Total number of visits is: 1
```

```
curl localhost:80
web1: Total number of visits is: 2
```
```
$ curl localhost:80
web2: Total number of visits is: 3
```

```
$ curl localhost:80
web2: Total number of visits is: 4
``` 


## Stop and remove the containers

```
$ docker-compose down
```

