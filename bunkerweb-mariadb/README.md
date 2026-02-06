## Compose sample application
### BunkerWeb protecting a web application with MariaDB and Valkey

Project structure:
```
.
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
```yaml
services:
  bunkerweb:
    image: bunkerity/bunkerweb:1.6.7
    ...
  bw-scheduler:
    image: bunkerity/bunkerweb-scheduler:1.6.7
    ...
  bw-ui:
    image: bunkerity/bunkerweb-ui:1.6.7
    ...
  bw-db:
    image: mariadb:11
    ...
  valkey:
    image: valkey/valkey:9-alpine
    ...
  app:
    image: bunkerity/bunkerweb-hello:v1.0
    ...
```
The compose file defines an application with BunkerWeb services (`bunkerweb`, `bw-scheduler`, `bw-ui`) using `bw-db` (MariaDB) for configuration storage and `valkey` (Valkey) for caching, along with a "Hello World" application (`app`) to be protected.

The setup follows production best practices: specific image versions, database password protection, and health checks.

## Deploy with docker compose

```shell
$ docker compose up -d
Creating network "bunkerweb-mariadb_bw-universe" with the default driver
Creating network "bunkerweb-mariadb_bw-services" with the default driver
Creating network "bunkerweb-mariadb_bw-db" with the default driver
Creating Volume "bunkerweb-mariadb_bw-data" with default driver
Creating Volume "bunkerweb-mariadb_bw-storage" with default driver
Creating Volume "bunkerweb-mariadb_valkey-data" with default driver
...
```

## Expected result

Listing containers must show the BunkerWeb stack and the app running:

```shell
$ docker compose ps
NAME                            COMMAND                  SERVICE             STATUS              PORTS
bunkerweb-mariadb-bunkerweb-1   "/entrypoint.sh …"       bunkerweb           running             0.0.0.0:80->8080/tcp, ...
bunkerweb-mariadb-bw-ui-1       "/entrypoint.sh …"       bw-ui               running             0.0.0.0:7000->7000/tcp
...
```

### Configuration Steps

1.  **Access the Web UI**: Open `http://localhost:7000` (Default: `admin` / `changeme`).
2.  **Configure protection**:
    -   Go to **Services** -> **Create**.
    -   **Server Name**: `localhost`
    -   **Reverse Proxy URL**: `/`
    -   **Reverse Proxy Host**: `http://app:80`
    -   **Apply**.

3.  **Visit Application**: Navigate to `http://localhost` to see the protected app.

Stop and remove the containers
```shell
$ docker compose down
```
