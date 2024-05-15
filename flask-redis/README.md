## Compose sample application
### Python/Flask application using a Redis database

Project structure:

```
.
├── Dockerfile
├── README.md
├── app.py
├── compose.yaml
└── requirements.txt
```

[_compose.yaml_](compose.yaml)

```
services:
   redis: 
     image: redislabs/redismod
     ports:
       - '6379:6379' 
   web:
        build: .
        ports:
            - "8000:8000"
        volumes:
            - .:/code
        depends_on:
            - redis
```

## Deploy with docker compose

```
$ docker compose up -d
[+] Running 24/24
 ⠿ redis Pulled   
 ...                                                                                                                                                                                                                                                                                                                                                                                                             
   ⠿ 565225d89260 Pull complete                                                                                                                                                                                                      
[+] Building 12.7s (10/10) FINISHED
 => [internal] load build definition from Dockerfile                                                                                                                                                                                  ...
[+] Running 3/3
 ⠿ Network flask-redis_default    Created                                                                                                                                                                                             
 ⠿ Container flask-redis-redis-1  Started                                                                                                                                                                                             
 ⠿ Container flask-redis-web-1    Started
```

## Expected result

Listing containers must show one container running and the port mapping as below:
```

$ docker compose ps
NAME                  COMMAND                  SERVICE             STATUS              PORTS
flask-redis-redis-1   "redis-server --load…"   redis               running             0.0.0.0:6379->6379/tcp
flask-redis-web-1     "/bin/sh -c 'python …"   web                 running             0.0.0.0:8000->8000/tcp
```

After the application starts, navigate to `http://localhost:8000` in your web browser or run:
```
$ curl localhost:8000
This webpage has been viewed 2 time(s)
```

## Monitoring Redis keys

Connect to redis database by using ```redis-cli``` command and monitor the keys.
```
redis-cli -p 6379
127.0.0.1:6379> monitor
OK
1646634062.732496 [0 172.21.0.3:33106] "INCRBY" "hits" "1"
1646634062.735669 [0 172.21.0.3:33106] "GET" "hits"
```


Stop and remove the containers
```
$ docker compose down
```
