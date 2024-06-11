# Awesome Compose [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

![logo](awesome-compose.jpg)

> A curated list of Docker Compose samples.

These samples provide a starting point for how to integrate different services using a Compose file and to manage their deployment with Docker Compose.

> **Note**
> The following samples are intended for use in local development environments such as project setups, tinkering with software stacks, etc. These samples must not be deployed in production environments.

<!--lint disable awesome-toc-->
## Contents

- [Samples of Docker Compose applications with multiple integrated services](#samples-of-docker-compose-applications-with-multiple-integrated-services).
- [Single service samples](#single-service-samples).
- [Basic setups for different platforms (not production ready - useful for personal use)](#basic-setups-for-different-platforms-not-production-ready---useful-for-personal-use).

## Samples of Docker Compose applications with multiple integrated services

<a href="https://docs.docker.com/desktop/wasm/"><img src="icon_wasm.svg" alt="Docker + wasm" height="30" align="top"/></a> Icon indicates Sample is compatible with [Docker+Wasm](https://docs.docker.com/desktop/wasm/).

- [`ASP.NET / MS-SQL`](aspnet-mssql) - Sample ASP.NET core application
with MS SQL server database.
- [`Elasticsearch / Logstash / Kibana`](elasticsearch-logstash-kibana) - Sample Elasticsearch, Logstash, and Kibana stack.
- [`Go / NGINX / MySQL`](nginx-golang-mysql) - Sample Go application
with an Nginx proxy and a MySQL database.
- [`Go / NGINX / PostgreSQL`](nginx-golang-postgres) - Sample Go
application with an Nginx proxy and a PostgreSQL database.
- [`Java Spark / MySQL`](sparkjava-mysql) - Sample Java application and
a MySQL database.
- [`NGINX / ASP.NET / MySQL`](nginx-aspnet-mysql) - Sample Nginx reverse proxy with an C# backend using ASP.NET.
- [`NGINX / Flask / MongoDB`](nginx-flask-mongo) - Sample Python/Flask
application with Nginx proxy and a Mongo database.
- [`NGINX / Flask / MySQL`](nginx-flask-mysql) - Sample Python/Flask application with an Nginx proxy and a MySQL database.
- [`NGINX / Node.js / Redis`](nginx-nodejs-redis) - Sample Node.js application with Nginx proxy and a Redis database.
- [`NGINX / Go`](nginx-golang) - Sample Nginx proxy with a Go backend.
- [`NGINX / WSGI / Flask`](nginx-wsgi-flask) - Sample Nginx reverse proxy with a Flask backend using WSGI.
- [`PostgreSQL / pgAdmin`](postgresql-pgadmin) - Sample setup for postgreSQL database with pgAdmin web interface.
- [`Python / Flask / Redis`](flask-redis) - Sample Python/Flask and a Redis database.
- [`React / Spring / MySQL`](react-java-mysql) - Sample React
application with a Spring backend and a MySQL database.
- [`React / Express / MySQL`](react-express-mysql) - Sample React
application with a Node.js backend and a MySQL database.
- [`React / Express / MongoDB`](react-express-mongodb) - Sample React
application with a Node.js backend and a Mongo database.
- [`React / Rust / PostgreSQL`](react-rust-postgres) - Sample React
application with a Rust backend and a Postgres database.
- [`React / Nginx`](react-nginx) - Sample React application with Nginx.
- [`Spring / PostgreSQL`](spring-postgres) - Sample Java application
with Spring framework and a Postgres database.
- [`WasmEdge / MySQL / Nginx`](wasmedge-mysql-nginx) - Sample Wasm-based web application with a static HTML frontend, using a MySQL (MariaDB) database. The frontend connects to a Wasm microservice written in Rust, that runs using the WasmEdge runtime.&nbsp;<a href="wasmedge-mysql-nginx"><img src="icon_wasm.svg" alt="Compatible with Docker+wasm" height="30" align="top"/></a>
- [`WasmEdge / Kafka / MySQL`](wasmedge-kafka-mysql) - Sample Wasm-based microservice that subscribes to a Kafka (Redpanda) queue topic, and transforms and saves any incoming message into a MySQL (MariaDB) database.&nbsp;<a href="wasmedge-kafka-mysql"><img src="icon_wasm.svg" alt="Compatible with Docker+wasm" height="30" align="top"/></a>

## Single service samples

- [`Angular`](angular)
- [`Spark`](sparkjava)
- [`VueJS`](vuejs)
- [`Flask`](flask)
- [`PHP`](apache-php)
- [`Traefik`](traefik-golang)
- [`Django`](django)
- [`Minecraft server`](https://github.com/docker/awesome-compose/tree/master/minecraft)
- [`Plex`](https://github.com/docker/awesome-compose/tree/master/plex)
- [`Portainer`](https://github.com/docker/awesome-compose/tree/master/portainer)
- [`Wireguard`](https://github.com/docker/awesome-compose/tree/master/wireguard)
- [`FastAPI`](fastapi)

## Basic setups for different platforms (not production ready - useful for personal use)

- [`Gitea / PostgreSQL`](gitea-postgres)
- [`Nextcloud / PostgreSQL`](nextcloud-postgres)
- [`Nextcloud / Redis / MariaDB`](nextcloud-redis-mariadb)
- [`Pi-hole / cloudflared`](pihole-cloudflared-DoH) - Sample Pi-hole setup with use of DoH cloudflared service
- [`Prometheus / Grafana`](prometheus-grafana)
- [`Wordpress / MySQL`](wordpress-mysql)

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

The root directory of each sample contains the `compose.yaml` which
describes the configuration of service components. All samples can be run in
a local environment by going into the root directory of each one and executing:

```console
docker compose up -d
```

Check the `README.md` of each sample to get more details on the structure and
what is the expected output.
To stop and remove all containers of the sample application run:

```console
docker compose down
```

### Quickstart guides

In addition to all the ready to run Compose samples listed above the folder [official-documentation-samples](official-documentation-samples/README.md) contains quickstart guides. Each of these step by step guides explain which files need to be created to build and run a Docker Compose application.

<!--lint disable awesome-toc-->
## Contribute

We welcome examples that help people understand how to use Docker Compose for
common applications. Check the [Contribution Guide](CONTRIBUTING.md) for more details. 
