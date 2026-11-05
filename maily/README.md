## Maily

This example provides a base setup for running [Maily](https://github.com/stormsia/maily) — a universal temporary email REST API gateway with dark-mode web console, OTP extractor, and SQLite WAL storage.

Project structure:
```
.
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
```yaml
services:
  maily:
    image: ghcr.io/stormsia/maily:latest
    container_name: maily
    restart: unless-stopped
    ports:
      - "8477:8477"
    volumes:
      - maily_data:/data
    environment:
      - MAILY_HOST=0.0.0.0
      - MAILY_PORT=8477
      - MAILY_API_KEY=${MAILY_API_KEY:-your_secret_api_key}
      - MAILY_DATA_DIR=/data

volumes:
  maily_data:
```

## Deploy with Docker Compose

When deploying this setup, the Maily web console and Swagger documentation will be available on port 8477 (e.g. `http://localhost:8477`).

```shell
docker compose up -d
```

## Expected result

Check containers are running:
```shell
docker compose ps
```

Navigate to `http://localhost:8477` in your browser to access the web console (authenticate with the configured `MAILY_API_KEY`, default: `your_secret_api_key`), or `http://localhost:8477/docs` for the interactive OpenAPI documentation.

Stop the containers with:
```shell
docker compose down
```

To delete all persistent data:
```shell
docker compose down -v
```
