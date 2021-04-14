## Compose sample application
### Python/FastAPI application

Project structure:
```
.
├── docker-compose.yaml
├── Dockerfile
├── requirements.txt
├── src
    ├── app.py
    ├── __init__.py

```

[_docker-compose.yaml_](docker-compose.yaml)
```
version: '3.7'
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: fastapi-service
    ports:
      - '8000:8000'
```

## Deploy with docker-compose

```shell
docker-compose up -d --build
```
## Expected result

Listing containers must show one container running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED              STATUS              PORTS                    NAMES
69893120c355   fastapi_api   "uvicorn --host 0.0.…"   About a minute ago   Up About a minute   0.0.0.0:8000->8000/tcp   fastapi-service
```

After the application starts, navigate to `http://localhost:8000` in your web browser and you should see the following json response:
```
{
"message": "OK"
}
```

Stop and remove the containers
```
$ docker-compose down
```


