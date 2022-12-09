# Compose sample application

![Compatible with Docker+Wasm](../icon_wasm.svg)

This sample demonstrates a web application with a WebAssembly (Wasm) microservice, written in Rust. The Wasm microservice is an HTTP API connected to a MySQL (MariaDB) database. The API is invoked via from JavaScript in a web interface serving static HTML. The microservice is compiled into WebAssembly (Wasm) and runs in the WasmEdge Runtime, a secure and lightweight alternative to natively compiled Rust apps in Linux containers. Checkout [this article](https://blog.logrocket.com/rust-microservices-server-side-webassembly/) or [this video](https://www.youtube.com/watch?v=VSqMPFr7SEs) to learn how the Rust code in this microservice works.

## Use with Docker Development Environments

You will need a version of Docker Desktop or Docker CLI with Wasm support.

* [Install Docker Desktop + Wasm (Beta)](https://docs.docker.com/desktop/wasm/)
* [Install Docker CLI + Wasm](https://github.com/chris-crone/wasm-day-na-22/tree/main/server)

## WasmEdge server with Nginx proxy and MySQL database

Project structure:

```
.
+-- compose.yml
|-- backend
    +-- Dockerfile
    |-- Cargo.toml
    |-- src
        +-- main.rs
|-- frontend
    +-- index.html
    |-- js
        +-- app.js
|-- db
    +-- orders.json
    |-- update_order.json
```

The [compose.yml](compose.yml) is as follows.

```yaml
services:
  frontend:
    image: nginx:alpine
    ports:
      - 8090:80
    volumes:
      - ./frontend:/usr/share/nginx/html

  backend:
    image: demo-microservice
    build:
      context: backend/
      platforms:
        - wasi/wasm32
    ports:
      - 8080:8080
    environment:
      DATABASE_URL: mysql://root:whalehello@db:3306/mysql
      RUST_BACKTRACE: full
    restart: unless-stopped
    runtime: io.containerd.wasmedge.v1

  db:
    image: mariadb:10.9
    environment:
      MYSQL_ROOT_PASSWORD: whalehello
```

The compose file defines an application with three services `frontend`, `backend` and `db`. The `frontend` is a simple Nginx server that hosts static web pages that access the `backend` web service, in the WasmEdge container, via HTTP port 8080. When deploying the application, docker compose maps port 8090 of the `frontend` service container to port 80 of the host as specified in the file. Make sure ports 80 and 8080 on the host is not already being in use.

## Deploy with docker compose

```bash
$ docker compose up -d
...
 ⠿ Network wasmedge-mysql-nginx_default       Created
 ⠿ Container wasmedge-mysql-nginx-db-1        Created
 ⠿ Container wasmedge-mysql-nginx-frontend-1  Created
 ⠿ Container wasmedge-mysql-nginx-backend-1   Created
```

## Expected result

```bash
$ docker compose ps
NAME                              COMMAND                  SERVICE             STATUS              PORTS
wasmedge-mysql-nginx-backend-1    "order_demo_service.…"   backend             running             0.0.0.0:8080->8080/tcp, :::8080->8080/tcp
wasmedge-mysql-nginx-db-1         "docker-entrypoint.s…"   db                  running             3306/tcp
wasmedge-mysql-nginx-frontend-1   "/docker-entrypoint.…"   frontend            running             0.0.0.0:8090->80/tcp, :::8090->80/tcp
```

After the application starts, navigate to `http://localhost:80` in your web browser to interact with the `backend` WasmEdge server and database through HTML and JavaScript. 
Alternatively, you can use the `curl` command to interact with the WasmEdge web service (i.e., the `backend` service).

When the WasmEdge web service receives a GET request to the `/init` endpoint, it would initialize the database with the `orders` table.

```bash
curl http://localhost:8080/init
```

When the WasmEdge web service receives a POST request to the `/create_order` endpoint, it extracts the JSON data from the POST body and inserts an `Order` record into the database table.
To insert multiple records, use the `/create_orders` endpoint and POST a JSON array of `Order` objects:

```bash
curl http://localhost:8080/create_orders -X POST -d @db/orders.json
```

When the WasmEdge web service receives a GET request to the `/orders` endpoint, it gets all rows from the `orders` table and return the result set in a JSON array in the HTTP response.

```bash
curl http://localhost:8080/orders
```

When the WasmEdge web service receives a POST request to the `/update_order` endpoint, it would extract the JSON data from the POST body and update the `Order` record in the database table that matches the `order_id` in the input data.

```bash
curl http://localhost:8080/update_order -X POST -d @db/update_order.json
```

When the WasmEdge web service receives a GET request to the `/delete_order` endpoint, it would delete the row in the `orders` table that matches the `id` GET parameter.

```bash
curl http://localhost:8080/delete_order?id=2
```

