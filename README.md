# Awesome Compose [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

![logo](awesome-compose.jpg)

> A curated list of Docker Compose samples.

These samples provide a starting point for how to integrate different services using a Compose file and to manage their deployment with Docker Compose.

> **Note:**
>
> The following samples are intended for use in local development environments such as project setups, tinkering with software stacks, etc. These samples must not be deployed in production environments.

<!--lint disable awesome-toc-->
## Contents

- [Samples of Docker Compose applications with multiple integrated services](#samples-of-docker-compose-applications-with-multiple-integrated-services).
- [Single service samples](#single-service-samples).
- [Basic setups for different platforms (not production ready - useful for personal use)](#basic-setups-for-different-platforms-not-production-ready---useful-for-personal-use).

## Samples of Docker Compose applications with multiple integrated services
- [`ASP.NET / MS-SQL`](https://github.com/docker/awesome-compose/tree/master/aspnet-mssql) - Sample ASP.NET core application
with MS SQL server database.
- [`Elasticsearch / Logstash / Kibana`](https://github.com/docker/awesome-compose/tree/master/elasticsearch-logstash-kibana) - Sample Elasticsearch, Logstash, and Kibana stack.
- [`Go / NGINX / MySQL`](https://github.com/docker/awesome-compose/tree/master/nginx-golang-mysql) - Sample Go application
with an Nginx proxy and a MySQL database.
- [`Go / NGINX / PostgreSQL`](https://github.com/docker/awesome-compose/tree/master/nginx-golang-postgres) - Sample Go
application with an Nginx proxy and a PostgreSQL database.
- [`Java Spark / MySQL`](https://github.com/docker/awesome-compose/tree/master/sparkjava-mysql) - Sample Java application and
a MySQL database.
- [`NGINX / Flask / MongoDB`](https://github.com/docker/awesome-compose/tree/master/nginx-flask-mongo) - Sample Python/Flask
application with Nginx proxy and a Mongo database.
- [`NGINX / Flask / MySQL`](https://github.com/docker/awesome-compose/tree/master/nginx-flask-mysql) - Sample Python/Flask
application with an Nginx proxy and a MySQL database.
- [`NGINX / Go`](https://github.com/docker/awesome-compose/tree/master/nginx-golang) - Sample Nginx proxy with a Go backend.
- [`React / Spring / MySQL`](https://github.com/docker/awesome-compose/tree/master/react-java-mysql) - Sample React
application with a Spring backend and a MySQL database.
- [`React / Express / MySQL`](https://github.com/docker/awesome-compose/tree/master/react-express-mysql) - Sample React
application with a Node.js backend and a MySQL database.
- [`React / Rust / PostgreSQL`](https://github.com/docker/awesome-compose/tree/master/react-rust-postgres) - Sample React
application with a Rust backend and a Postgres database.
- [`Spring / PostgreSQL`](https://github.com/docker/awesome-compose/tree/master/spring-postgres) - Sample Java application
with Spring framework and a Postgres database.  
## Single service samples
- [`Angular`](https://github.com/docker/awesome-compose/tree/master/angular)
- [`Spark`](https://github.com/docker/awesome-compose/tree/master/sparkjava)
- [`VueJS`](https://github.com/docker/awesome-compose/tree/master/vuejs)
- [`Flask`](https://github.com/docker/awesome-compose/tree/master/flask)
- [`PHP`](https://github.com/docker/awesome-compose/tree/master/apache-php)
- [`Traefik`](https://github.com/docker/awesome-compose/tree/master/traefik-golang)
- [`Django`](https://github.com/docker/awesome-compose/tree/master/django)
- [`Minecraft server`](https://github.com/docker/awesome-compose/tree/master/minecraft)
## Basic setups for different platforms (not production ready - useful for personal use) 
- [`Gitea / PostgreSQL`](https://github.com/docker/awesome-compose/tree/master/gitea-postgres)
- [`Nextcloud / PostgreSQL`](https://github.com/docker/awesome-compose/tree/master/nextcloud-postgres)
- [`Nextcloud / Redis / MariaDB`](https://github.com/docker/awesome-compose/tree/master/nextcloud-redis-mariadb)
- [`Wordpress / MySQL`](https://github.com/docker/awesome-compose/tree/master/wordpress-mysql)
- [`Prometheus / Grafana`](https://github.com/docker/awesome-compose/tree/master/prometheus-grafana)

<!--lint disable awesome-toc-->
## Getting started

These instructions will get you through the bootstrap phase of creating and
deploying samples of containerized applications with Docker Compose.

### Prerequisites

- Make sure that you have Docker and Docker Compose installed
  - Windows or macOS:
    [Install Docker Desktop](https://www.docker.com/get-started)
  - Linux: [Install Docker](https://www.docker.com/get-started) and then
    [Docker Compose](https://github.com/docker/compose)
- Download some or all of the samples from this repository.

### Running a sample

The root directory of each sample contains the `docker-compose.yaml` which
describes the configuration of service components. All samples can be run in
a local environment by going into the root directory of each one and executing:

```console
docker-compose up -d
```

Check the `README.md` of each sample to get more details on the structure and
what is the expected output.
To stop and remove all containers of the sample application run:

```console
docker-compose down
```
<!--lint disable awesome-toc-->
## Contribute

We welcome examples that help people understand how to use Docker Compose for
common applications. Check the [Contribution Guide](CONTRIBUTING.md) for more details. 
