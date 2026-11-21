## Compose sample application
### Go + Redis

This sample demonstrates how to run a simple Go HTTP application backed by a
Redis datastore using Docker Compose.

The Go application exposes a basic HTTP endpoint. Each request increments a
counter value stored in Redis and returns the updated count.

---

## Project structure

```

.
├── app
│   ├── Dockerfile
│   ├── main.go
│   ├── go.mod
│   └── go.sum
├── compose.yaml
└── README.md

````

---

## Services

- **app**: Go HTTP server that handles incoming requests and communicates with Redis
- **redis**: Redis key-value store used to persist the counter value

---

## Compose file

[_compose.yaml_](compose.yaml)

```yaml
services:
  app:
    build: app
    ports:
      - 8080:8080
    depends_on:
      - redis

  redis:
    image: redis:7-alpine
````

### Explanation

* The `app` service builds a Docker image from the `app` directory.
* The Go application listens on port `8080` inside the container.
* Port `8080` of the container is mapped to port `8080` on the host.
* The `redis` service runs an official Redis image.
* The Go application connects to Redis using the service name `redis` as the hostname.

---

### Optional: Clean Go modules

Before building, you can run inside `app`:

```bash
cd app
go mod tidy


## Deploy with docker compose

From the project directory, run:

```console
$ docker compose up -d
```

Docker Compose will:

* Build the Go application image
* Start the Redis container
* Start the Go HTTP server

---

## Expected result

Listing containers must show two containers running:

```console
$ docker compose ps
```

Example output:

```
NAME                   SERVICE   STATUS    PORTS
go-redis-app-1         app       running   0.0.0.0:8080->8080/tcp
go-redis-redis-1       redis     running
```

---

## Access the application

Open your browser or run:

```console
$ curl http://localhost:8080/count
```

Each request increments a counter stored in Redis and returns a response similar
to the following:

```
count : 1
```

---

## Stop the application

To stop and remove the containers and network, run:

```console
$ docker compose down
```

---

