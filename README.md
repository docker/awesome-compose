# Awesome Compose [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

![logo](awesome-compose.jpg)

> A curated list of docker-compose application samples. 
The purpose of these samples is to provide a quick start on how to integrate different services with a Compose file and to quickly manage their deployment with docker-compose.


## Getting Started

These instructions will get you through the bootstrap phase of creating and deploying samples of containerized applications with docker-compose.


### Prerequisites

Make sure you have docker and docker-compose installed. Download all or any of the samples in the `samples` directory.

### Running a sample

The root directory of each sample contains the docker-compose.yaml describing the configuration of service components. All samples can be run in local environment by going into the root directory of each one and doing:
```
docker-compose up -d
```
Check the `README.md` of each sample to get more details on the structure and what is the expected output.
To stop and remove the running containers of the sample application do:
```
docker-compose down
```


## Contents

*Samples of docker-compose applications with multiple integrated services:*

- [`Asp.NET/MS-SQL`](samples/aspnet-mysql/README.md) -- sample asp\\.net core application with MySQL database
- [`Flask / NGINX / MySQL`](samples/nginx-flask-mysql/README.md) -- sample Python/Flask application with an Nginx proxy and a MySQL database
- [`Go / NGINX / MySQL`](samples/nginx-golang-mysql/README.md) -- sample Go application with an Nginx proxy and a MySQL database
- [`Go / NGINX / PostgreSQL`](samples/nginx-golang-postgres/README.md) -- sample Go application with an Nginx proxy and a PostgreSQL database
- [`Java / MySQL`](samples/sparkjava-mysql/README.md) -- sample Java application and a MySQL database
- [`NGINX / Go`](samples/nginx-gohttp_1/README.md) -- sample Nginx application with a Go backend 
- [`NGINX / Go`](samples/nginx-gohttp_2/README.md) -- another Nginx sample application with a Go backend
- [`React / Spring / MySQL`](samples/react-java-mysql/README.md) -- sample React application with a Spring backend and a MySQL database
- [`React / Express / MySQL`](samples/react-express-mysql/README.md) -- sample React application with a NodeJS backend and a MySQL database
- [`Spring / PostgreSQL`](samples/spring-postgres/README.md) -- sample Java application with Spring framework and a Postgres database


*Single service samples:*
- [`Angular`](samples/angular/README.md)
- [`VueJS`](samples/vuejs/README.md)

## Contribute

Contributions welcome! Read the [contribution guidelines](contributing.md) first.

