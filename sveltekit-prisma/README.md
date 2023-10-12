# Compose sample application

## Sveltekit + Prisma + Docker

Project structure

```
.
└───Dockerfile
└───compose.yaml
└───prisma/
└───src/
```

[_compose.yaml_](compose.yaml)

```
services:
  server:
	container_name: sveltekit-prisma-server
    ...
  db:
	container_name: sveltekit-prisma-db
    image: postgres
    ...
```

## Deploy with docker compose

Once you've cloned the repo and copyied environment variables from `.env.docker` to `.env` manually or via using `cp .env.docker .env`, you are good to go:

```
$ docker compose up -d
.
.
 ✔ Network sveltekit-prisma-network   Created
 ✔ Container sveltekit-prisma-db   Healthy
 ✔ Container sveltekit-prisma-server  Started
```

### Expected Result

```
$ docker ps
CONTAINER ID   IMAGE                     COMMAND                  CREATED       STATUS                 PORTS                    NAMES
0f83542117ca   sveltekit-prisma-server   "docker-entrypoint.s…"   2 hours ago   Up 2 hours             0.0.0.0:3000->3000/tcp   sveltekit-prisma-server
b62c6c06bc48   postgres                  "docker-entrypoint.s…"   2 hours ago   Up 2 hours (healthy)   0.0.0.0:5432->5432/tcp   sveltekit-prisma-db
```

After the application starts, navigate to below link to view it:

Sveltekit App: [`http://localhost:3000`](http://localhost:3000)

![page](output.webp)

Stop and remove the containers

```
$ docker compose down
```

## Run in local with database in docker

Copy the environment variables in .env.local to .env folder, and run the postgres container for database with the below command:

```
$ docker compose up -d db
```

After this as usual install the dependencies with `npm install` and follow the bellow commands to make application up and running:

- `npx prisma generate` to generate the prisma client
- `npx prisma migrate dev` to apply the migration
- `npm run dev` to start the development server

After the application starts, navigate to below link to view it:

Sveltekit App: [`http://localhost:3000`](http://localhost:3000)

To stop and remove the container

```
$ docker compose down db
```
