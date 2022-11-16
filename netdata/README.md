## Compose sample
### Netdata

Project structure:
```
.
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
```yaml
version: '3'
services:
  netdata:
    image: netdata/netdata
    container_name: netdata
    hostname: example.com # set to fqdn of host
    ports:
      - 19999:19999
    restart: unless-stopped
    cap_add:
      - SYS_PTRACE
    security_opt:
      - apparmor:unconfined
    volumes:
      - netdataconfig:/etc/netdata
      - netdatalib:/var/lib/netdata
      - netdatacache:/var/cache/netdata
      - /etc/passwd:/host/etc/passwd:ro
      - /etc/group:/host/etc/group:ro
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /etc/os-release:/host/etc/os-release:ro

volumes:
  netdataconfig:
  netdatalib:
  netdatacache:
```
The compose file defines a stack with the service `netdata` and available at port `19999` by default. More information around installation options and configuration via Docker can be found in the Netdata docs [here](https://learn.netdata.cloud/docs/agent/packaging/docker).
Make sure the port 19999 on the host is not already in use.

## Deploy with docker compose

```
$ docker compose up -d
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
TODO
```

Navigate to `http://localhost:19999` in your web browser to access the local Netdata dashboard.

![page](output.jpg)

Stop and remove the containers. Use `-v` to remove the volumes if looking to erase all data.
```
$ docker compose down -v
```
