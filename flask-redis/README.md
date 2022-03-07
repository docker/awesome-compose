## Compose sample application
### Python/Flask application

Project structure:
```
.
├── docker-compose.yaml
├── app
    ├── Dockerfile
    ├── requirements.txt
    └── app.py

```

[_docker-compose.yaml_](docker-compose.yaml)
```
services: 
  web: 
    build: app 
    ports: 
      - '5000:5000'
```

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "flask_default" with the default driver
Building web
Step 1/6 : FROM python:3.7-alpine
...
...
Status: Downloaded newer image for python:3.7-alpine
Creating flask_web_1 ... done

```

## Expected result

Listing containers must show one container running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                  NAMES
c126411df522        flask_web                    "python3 app.py"         About a minute ago  Up About a minute   0.0.0.0:5000->5000/tcp flask_web_1
```

After the application starts, navigate to `http://localhost:5000` in your web browser or run:
```
$ curl localhost:5000
Hello World!
```

Stop and remove the containers
```
$ docker-compose down
```
