# Compose sample application

![Compatible with Docker+Wasm](../icon_wasm.svg)

This sample demonstrates a WebAssembly (Wasm) microservice written in Rust. It subscribes to a Kafka queue topic on a Redpanda server, and then transforms and saves each message into a MySQL (MariaDB) database table. The microservice is compiled into Wasm and runs in the WasmEdge runtime, which is a secure and lightweight alternative to natively compiled Rust apps in Linux containers.

## Use with Docker Development Environments

You will need a version of Docker Desktop or Docker CLI with Wasm support.

* [Install Docker Desktop + Wasm (Beta)](https://docs.docker.com/desktop/wasm/)
* [Install Docker CLI + Wasm](https://github.com/chris-crone/wasm-day-na-22/tree/main/server)

## WasmEdge server with Redpanda and MySQL database

Project structure:

```
.
+-- compose.yml
|-- etl
    |-- Dockerfile
    |-- Cargo.toml
    +-- src
        |-- main.rs
|-- kafka
    |-- order.json
|-- db
    |-- db-password.txt
```

The [compose.yml](compose.yml) is as follows.

```yaml
services:
  redpanda:
    image: docker.redpanda.com/vectorized/redpanda:v22.2.2
    command:
      - redpanda start
      - --smp 1
      - --overprovisioned
      - --node-id 0
      - --kafka-addr PLAINTEXT://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092
      - --advertise-kafka-addr PLAINTEXT://redpanda:29092,OUTSIDE://redpanda:9092
      - --pandaproxy-addr 0.0.0.0:8082
      - --advertise-pandaproxy-addr localhost:8082
    ports:
      - 8081:8081
      - 8082:8082
      - 9092:9092
      - 9644:9644
      - 29092:29092
    volumes:
      - ./kafka:/app

  etl:
    image: etl-kafka
    build:
      context: etl
      platforms:
        - wasi/wasm32
    environment:
      DATABASE_URL: mysql://root:whalehello@db:3306/mysql
      KAFKA_URL: kafka://redpanda:9092/order
      RUST_BACKTRACE: full
      RUST_LOG: info
    restart: unless-stopped
    runtime: io.containerd.wasmedge.v1

  db:
    image: mariadb:10.9
    environment:
      MYSQL_ROOT_PASSWORD: whalehello
```

The compose file defines an application with three services `redpanda`, `etl` and `db`. The `redpanda` service is a Kafka-compatible messaging server that produces messages in a queue topic. The `etl` service, in the WasmEdge container that subscribes to the queue topic and receives incoming messages. Each incoming message is parsed and stored in the `db` MySQL (MariaDB) database server.

## Deploy with docker compose

```bash
$ docker compose up -d
...
 ⠿ Network wasmedge-kafka-mysql_default       Created                      0.1s
 ⠿ Container wasmedge-kafka-mysql-redpanda-1  Created                      0.3s
 ⠿ Container wasmedge-kafka-mysql-etl-1       Created                      0.3s
 ⠿ Container wasmedge-kafka-mysql-db-1        Created                      0.3s
```

## Expected result

```bash
$ docker compose ps
NAME                              COMMAND                  SERVICE             STATUS              PORTS
wasmedge-kafka-mysql-db-1         "docker-entrypoint.s…"   db                  running             3306/tcp
wasmedge-kafka-mysql-etl-1        "kafka.wasm"             etl                 running
wasmedge-kafka-mysql-redpanda-1   "/entrypoint.sh 'red…"   redpanda            running             0.0.0.0:8081-8082->8081-8082/tcp, :::8081-8082->8081-8082/tcp, 0.0.0.0:9092->9092/tcp, :::9092->9092/tcp, 0.0.0.0:9644->9644/tcp, :::9644->9644/tcp, 0.0.0.0:29092->29092/tcp, :::29092->29092/tcp
```

After the application starts, 
log into the Redpanda container and send a message to the queue topic `order` as follows.

```bash
$ docker compose exec redpanda /bin/bash
redpanda@1add2615774b:/$ cd /app
redpanda@1add2615774b:/app$ cat order.json | rpk topic produce order
Produced to partition 0 at offset 0 with timestamp 1667922788523.
```

To see the data in the database container, you can use the following commands.

```bash
$ docker compose exec db /bin/bash
root@c97c472db02e:/# mysql -u root -pwhalehello mysql
mysql> select * from orders;
... ...
```

