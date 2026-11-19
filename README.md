# Express application with MongoDB database

## App diagram

The compose file defines an application with two services: `backend` and `mongo`.

When deploying the application, `docker compose` maps port 3000 of the `backend`
service container to port 3000 of the host as specified in the `compose.yaml`
file.

Make sure port 3000 on the host is not already in use.

## Deploy with docker compose

```shell
$ docker compose up -d
```

Expected result: listing containers must show two containers running and
healthy. Healthcheck isn't enabled by default, but the logs should show the
server listening and connected to MongoDB.

```shell
$ docker compose ps

NAME       IMAGE                    COMMAND                  SERVICE    STATUS
backend    express-mongodb-backend  "docker-entrypoint.s…"   backend    running
mongo      mongo:7                  "docker-entrypoint.s…"   mongo      running
```

After the application starts, navigate to `http://localhost:3000` in your web
browser or run:

```shell
$ curl http://localhost:3000
{"message":"Express + MongoDB API is running"}
```

### Try the API

Create a note:

```shell
$ curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "First note", "content": "Hello from MongoDB"}'
```

List notes:

```shell
$ curl http://localhost:3000/notes
```

Stop and remove the containers:

```shell
$ docker compose down
```

## Expected result

Listing containers must show two containers running and healthy:

```shell
$ docker compose ps
NAME       IMAGE                    COMMAND                  SERVICE    STATUS
backend    express-mongodb-backend  "docker-entrypoint.s…"   backend    running
mongo      mongo:7                  "docker-entrypoint.s…"   mongo      running
```

After the application starts, you can use the API endpoints described above
to create, list, update, and delete notes stored in MongoDB.

Stop and remove the containers with:

```shell
$ docker compose down
```
