## GenieACS with MongoDB

This example defines a basic setup for [GenieACS](https://genieacs.com/), an
open-source [TR-069 (CWMP)](https://en.wikipedia.org/wiki/TR-069) Auto
Configuration Server used to remotely manage CPE devices such as routers, ONTs
and gateways. GenieACS stores its data in a MongoDB database.

> **Note**
> This sample is intended for local/development use and is **not production
> ready**. Before using it anywhere real, replace the sample
> `GENIEACS_UI_JWT_SECRET` value and enable authentication on MongoDB.

Project structure:
```
.
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
```yaml
services:
  genieacs:
    image: drumsergio/genieacs:1.2.16.0
    environment:
      - GENIEACS_UI_JWT_SECRET=changeme
      - GENIEACS_MONGODB_CONNECTION_URL=mongodb://mongo/genieacs
    ports:
      - 7547:7547
      - 7557:7557
      - 7567:7567
      - 3000:3000
    ...
  mongo:
    image: mongo:8.0
    expose:
      - 27017
    ...
```

The `genieacs` container exposes four ports on the host:

| Port | Service | Description                       |
|------|---------|-----------------------------------|
| 7547 | CWMP    | TR-069 endpoint for CPE devices   |
| 7557 | NBI     | Northbound REST API               |
| 7567 | FS      | File server (firmware/config)     |
| 3000 | UI      | Web user interface                |

MongoDB is kept as an internal service and is only reachable from the other
containers on the Compose network.

## Deploy with docker compose

```
$ docker compose up -d
[+] Running 3/3
 ✔ Network genieacs-mongodb_default   Created
 ✔ Container genieacs-mongodb-mongo-1 Healthy
 ✔ Container genieacs-mongodb-genieacs-1 Started
```

## Expected result

Check the containers are running and the port mapping:
```
$ docker compose ps
NAME                          IMAGE                       COMMAND                  SERVICE    STATUS              PORTS
genieacs-mongodb-genieacs-1   drumsergio/genieacs:1.2.16.0   "..."                 genieacs   Up                  0.0.0.0:3000->3000/tcp, 0.0.0.0:7547->7547/tcp, 0.0.0.0:7557->7557/tcp, 0.0.0.0:7567->7567/tcp
genieacs-mongodb-mongo-1      mongo:8.0                   "docker-entrypoint.s…"   mongo      Up (healthy)        27017/tcp
```

Navigate to `http://localhost:3000` in your web browser to access the GenieACS
UI. On first launch, create the initial admin user through the login screen.

Point your TR-069 devices' ACS URL at `http://<host>:7547`.

Stop and remove the containers:
```
$ docker compose down
```

To also remove the MongoDB data, delete the named volume by passing the `-v`
flag:
```
$ docker compose down -v
```
