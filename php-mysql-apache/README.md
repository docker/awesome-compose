## Compose sample application
### PHP and MySQL application with Apache2

Project structure:
```
.
├── docker-compose.yaml
├── mysql
│   └── Dockerfile
├── php
│   ├── Dockerfile
│   ├── index.php
│   └── query.php
└── README.md

```

[_docker-compose.yaml_](docker-compose.yaml)
```
services:

  php:
    image: php:8.0-apache
    build: php
    container_name: php_container
    networks:
      pm_net:
        ipv4_address: 172.17.0.2
    ports:
      - 8000:80
    volumes:
      - ./php:/var/www/html/
    command: >
      bash -c "apt-get update &&
             docker-php-ext-install pdo_mysql &&
             docker-php-ext-enable pdo_mysql &&
             apache2-foreground"

  db:
    image: mysql
    build: mysql
    container_name: mysql_container
    networks:
      pm_net:
        ipv4_address: 172.17.0.3
    ports:
      - 8001:3306
      - 8002:33060
    volumes:
      - ./mysql:/var/www/mysql
    environment:
      MYSQL_USERNAME: "root"
      MYSQL_ROOT_PASSWORD: ""
      MYSQL_ALLOW_EMPTY_PASSWORD: "true"
    depends_on:
      - php

  pma:
    image: phpmyadmin
    container_name: pma_container
    networks:
      pm_net:
        ipv4_address: 172.17.0.4
    ports:
      - 8003:80
    depends_on:
      - db

networks:
  pm_net:
    driver: bridge
    ipam:
      config:
        - subnet: 172.17.0.0/16
          gateway: 172.17.0.5
```
#### docker-compose file description

We have three services (containers) in docker-compose, PHP 8.0 with Apache web server, MySQL database, and PhpMyAdmin.

These containers are going to connect together via `pm_net (bridge)` network.
Each of these have their own static IPs. Of course their ports are exposed to be accessed later.

Note that we have a `command` attribute in `php` service. This command tells the container to install `pdo_mysql` PHP extension to deal with MySQL through PHP by `PDO` Class. Running the command is important if you are using `PDO` class to access the database.


## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "php-mysql-apache_pm_net" with driver "bridge"
Creating php_container ... done
Creating mysql_container ... done
Creating pma_container   ... done
Attaching to php_container, mysql_container, pma_container
...
...
```

**Important: Running `docker-compose up` may take a few moments to start, due to installing `pdo_mysql` extension. So be patient.**

## Expected result

Listing containers must show three containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS         PORTS                                                                                    NAMES
edb55669d222   phpmyadmin       "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes   0.0.0.0:8003->80/tcp, :::8003->80/tcp                                                    pma_container
14359ec051f8   mysql            "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes   0.0.0.0:8001->3306/tcp, :::8001->3306/tcp, 0.0.0.0:8002->33060/tcp, :::8002->33060/tcp   mysql_container
bc2d05ab3dc2   php:8.0-apache   "docker-php-entrypoi…"   2 minutes ago   Up 2 minutes   0.0.0.0:8000->80/tcp, :::8000->80/tcp                                                    php_container
```

After the application starts, navigate to `http://localhost:8000` in your web browser to run `index.php` file or run:
```
$ curl localhost:8000
Hello World
```

You see that it's just a simple Hello-world string, but some queries happens under the hood. First the application connects to MySQL with `pdo_mysql` php extension, after that, it checks the database if `MyDatabase` exists or not. Then creates a table, inserts data as `Hello world` into it, and PHP application fetches the data and shows the output by the browser.

If you want to access `PhpMyAdmin` navigate to `http://localhost:8003` in your browser.

Stop and remove the containers
```
$ docker-compose down
```
