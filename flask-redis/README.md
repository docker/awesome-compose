## Compose sample application
### Python/Flask application

Project structure:
```
.
├── Dockerfile
├── README.md
├── app.py
├── docker-compose.yml
└── requirements.txt
```

[_docker-compose.yaml_](docker-compose.yaml)
```
services: 
  web: 
    build: app 
    ports: 
      - '5000:5000'
```

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "flask-redis_default" with the default driver
Pulling redis (redislabs/redismod:)...
...
...
web_1    |    WARNING: This is a development server. Do not use it in a production deployment.
web_1    |  * Running on http://172.19.0.3:5000/ (Press CTRL+C to quit)
web_1    |  * Restarting with stat
web_1    |  * Debugger is active!
web_1    |  * Debugger PIN: 598-320-965
```

## Expected result

Listing containers must show one container running and the port mapping as below:
```

$ docker-compose ps
NAME                  COMMAND                  SERVICE             STATUS              PORTS
flask-redis-redis-1   "redis-server --load…"   redis               running             0.0.0.0:6379->6379/tcp
flask-redis-web-1     "/bin/sh -c 'python …"   web                 running             0.0.0.0:5000->5000/tcp
```

After the application starts, navigate to `http://localhost:5000` in your web browser or run:
```
$ curl localhost:5000

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
$ docker-compose down
```
