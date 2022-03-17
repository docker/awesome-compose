# Compose sample application

## Caddy/FastAPI application ⛳

Deploy [Caddy](https://caddyserver.com/) + [FastAPI](https://fastapi.tiangolo.com/) with docker-compose

Project structure:

```text
├── docker-compose.yaml
├── Dockerfile
├── requirements.txt
├── src
    ├── caddy
        ├── Caddyfile
        ├── Dockerfile
        ├── start.sh
    ├── caddy
        ├── Dockerfile
        ├── main.py
        ├── requirements.txt
```

[_docker-compose.yaml_](docker-compose.yaml)

```yaml
services:
  fastapi:
    container_name: fastapi
    restart: unless-stopped
    build:
      context: ./src/fastapi
      dockerfile: ./Dockerfile
    ports:
      - 8000:8000
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 5m
      timeout: 5s
      retries: 3
      start_period: 15s

  caddy:
    container_name: caddy
    restart: unless-stopped
    build:
      context: ./src/caddy
      dockerfile: ./Dockerfile
    ports:
      - 80:80
      - 443:443
    volumes:
      - ./data/caddy_data:/data
      - ./data/caddy_config:/config
    depends_on:
      - fastapi
    environment:
      PROXY_BACKEND: fastapi
      PROXY_PORT: 8000
      DOMAIN: ${DOMAIN}

volumes:
  caddy_data:
  caddy_config:
```

## Deploy with docker-compose

```bash
docker-compose up --build
```

> Note: You will see `WARNING: The DOMAIN variable is not set. Defaulting to a blank string.` and that is expected - See the extra info section below for more details

## Expected result

Listing containers must show one container running and the port mapping as below:

```console
$ docker ps
CONTAINER ID   IMAGE          COMMAND       CREATED              STATUS              PORTS                                               NAMES
52d5fbe3dc5d   caddy-fastapi_caddy     "sh /app/start.sh"       12 seconds ago   Up 1 second                      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp, 2019/tcp   caddy
09677bb1297e   caddy-fastapi_fastapi   "python -m uvicorn m…"   13 seconds ago   Up 1 second (health: starting)   0.0.0.0:8000->8000/tcp
```

After the application starts, navigate to [localhost](https://localhost:443/) in your web browser and you should see the following json response:

```json
{"Hello":"World"}
```

Stop and remove the containers

```console
$ docker-compose down
WARNING: The DOMAIN variable is not set. Defaulting to a blank string.
Stopping caddy   ... done
Stopping fastapi ... done
Removing caddy   ... done
Removing fastapi ... done
Removing network caddy-fastapi_default
```

## Additional Information 📚

This section contains additional information about the docker-compose sample application

### TLS Certificate 🔐

Caddy automatically provisions TLS certificates for you. In order to make use of this awesome feature, do the following:

1. Ensure your server has ports `80` and `443` open
1. Have a DNS record pointed to your server for the domain you wish to obtain a certificate for (e.g. `app.example.org` -> `<IP address>`)
1. Export the env var for the domain you wish to use:

    ```bash
    export DOMAIN=app.example.org
    ```

1. Start the docker-compose stack:

   ```bash
   docker-compose up --build
   ```

1. Navigate to your domain and enjoy your easy TLS setup with Caddy! -> [https://app.example.org](https://app.example.orgg)

### Extra Extra Info 📚

Here is some extra info about the setup

#### Volumes 🛢️

The docker-compose file creates two volumes:

- `./data/caddy_data:/data`
- `./data/caddy_config:/config`

The config volume is used to mount Caddy configuration

The data volume is used to store certificate information. This is really important so that you are not re-requesting TLS certs each time you start your container. Doing so can cause you to hit Let's Encrypt rate limits that will prevent you from provisioning certificates.

### Environment Variables 📝

If you run the stack without the `DOMAIN` variable set in your environment, the stack will default to using `localhost`. This is ideal for testing out the stack locally.

If you set the `DOMAIN` variable, Caddy will attempt to provision a certificate for that domain. In order to do so, you will need DNS records pointed to that domain and you will need need traffic to access your server via port `80` and `443`.
