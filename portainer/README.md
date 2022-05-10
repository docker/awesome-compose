## Portainer (CE)
This example provides a base setup for using [Portainer](https://www.portainer.io/).
More details on how to customize the installation and the compose file can be found in [portainer documentation](https://documentation.portainer.io/).

### Demo
You can try out the public demo instance first: http://demo.portainer.io/
- username: admin
- password: tryportainer

Project structure:
```
.
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
``` yaml
services:
  portainer:
    image: portainer/portainer-ce:alpine
```

## Deploy with docker compose
When deploying this setup, the web interface will be available on port 9000 (e.g. http://localhost:9000).

``` shell
$ docker compose up -d
Starting portainer ... done
```


## Expected result

Check containers are running:
```
$ docker ps
CONTAINER ID   IMAGE                           COMMAND                  CREATED          STATUS                          PORTS                                                                                  NAMES
860311c00e62   portainer/portainer-ce:alpine   "/portainer -H unix:…"   54 seconds ago   Up 53 seconds                   8000/tcp, 0.0.0.0:9000->9000/tcp, :::9000->9000/tcp                                    portainer

```

Navigate to `http://localhost:9000` in your web browser to access the portainer web interface and create an account.


Stop the containers with
``` shell
$ docker compose down
# To delete all data run:
$ docker compose down -v
```

## Troubleshooting
- Select the correct image for your OS. You can take a look at the published tags at [DockerHub](https://hub.docker.com/r/portainer/portainer-ce/tags)
  
> e.g. currently, the latest tag is for Windows (amd64) and alpine for Linux (amd64, arm/v7)