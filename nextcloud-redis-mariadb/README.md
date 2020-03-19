## Nextcloud with Redis and MariaDB
This example defines one of the basic setups for Nextcloud. More details on how to
further customize the installation and the compose file can be found on the
[official image page](https://hub.docker.com/_/nextcloud).


Project structure:
```
.
├── docker-compose.yaml
└── README.md
```

[_docker-compose.yaml_](docker-compose.yaml)
```
services:
  nc:
    image: nextcloud:apache
    ports:
      - 80:80
    ...
  redis:
    image: redis:alpine
    restart: always
    networks:
      - redisnet
  db:
    image: mariadb
    ...
```

When deploying this setup, docker-compose maps the nextcloud container port 80 to
port 80 of the host as specified in the compose file.

## Deploy with docker-compose

```
$ docker$ compose up -d
Creating network "nextcloud-redis-mariadb_redisnet" with the default driver
Creating network "nextcloud-redis-mariadb_dbnet" with the default driver
Creating volume "nextcloud-redis-mariadb_nc_data" with default driver
Pulling redis (redis:alpine)...
alpine: Pulling from library/redis....
....
Status: Downloaded newer image for mariadb:latest
Creating nextcloud-redis-mariadb_db_1    ... done
Creating nextcloud-redis-mariadb_nc_1    ... done
Creating nextcloud-redis-mariadb_redis_1 ... done
```


## Expected result

Check containers are running and the port mapping:
```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
6541add4d648        nextcloud:apache    "/entrypoint.sh apac…"   35 seconds ago      Up 34 seconds       0.0.0.0:80->80/tcp   nextcloud-redis-mariadb_nc_1
6c656f98cf14        redis:alpine        "docker-entrypoint.s…"   35 seconds ago      Up 34 seconds       6379/tcp             nextcloud-redis-mariadb_redis_1
6d4c6630a4a3        mariadb             "docker-entrypoint.s…"   35 seconds ago      Up 34 seconds       3306/tcp             nextcloud-redis-mariadb_db_1
```

Navigate to `http://localhost:80` in your web browser to access the installed
Nextcloud service.

![page](output.jpg)

Stop and remove the containers

```
$ docker-compose down
```

To delete all data, remove all named volumes by passing the `-v` arguments:
```
$ docker-compose down -v
```
