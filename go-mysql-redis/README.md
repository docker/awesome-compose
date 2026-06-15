## Run an application on golang http server, and mysql database and redis datastore(can use as cache).

Project Structure:-
```
├── Dockerfile
├── go.mod
├── main.go
├── go.sum
├── docker-compose.yml
├── makefile
├── vendor
└── README.md 
```

### docker-compose.yml
The compose file define an application with three services `app` , `mysql` and `redis`. The application is deployed on port 8080 and it maps port 3307 for mysql and 6378 for redis on host, so if you have other instance of mysql or redis running already on port 3306 and port 6379, then also the application will run fine.

### makefile
The default goal for make is help, and it looks like this
```
Usage:
  make [target...]

Useful commands:
  build                          to build the project again after making changes
  compose                        to run the containers
  down                           docker-compose down
  pruneVolume                    remove all dangling volumes
  runLocal                       to run the app locally
```

### To run the containers
```
make compose
```
this will remove all the dangling volumes first, then build the project using flag no-cache, and then run the containers.

### expected result
```
docker container ls
```
```
CONTAINER ID        IMAGE                     COMMAND                  CREATED             STATUS                    PORTS                               NAMES
fb91b303db93        docker-contribution_app   "./main"                 40 seconds ago      Up 38 seconds             0.0.0.0:8080->8080/tcp              goapp
19a5b083084d        redis:latest              "docker-entrypoint.s…"   40 seconds ago      Up 39 seconds             0.0.0.0:6378->6379/tcp              goapp_redis
3da52c78e384        mysql/mysql-server:5.7    "/entrypoint.sh mysq…"   40 seconds ago      Up 39 seconds (healthy)   33060/tcp, 0.0.0.0:3307->3306/tcp   goapp_mysql
```

### type localhost:8080 in browser if the connection to both the database is successful and ping is possible then you will see

```
Connection to mysql and redis successful
```

