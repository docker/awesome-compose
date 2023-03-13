# How to run these examples in the CSCC VMs

To run these examples, we need a newer version of docker compose.

Here is what we are doing:

```bash

docker run --rm \
   --volume /var/run/docker.sock:/var/run/docker.sock \ #bind mounts a volume. This mounts the docker.sock on your VM to the docker.sock in the container
   --volume "$PWD:$PWD" \ # this bind mounts the current path, to the working directory in docker compose container
   --workdir="$PWD" \ #sets the working directory to the default path in the container
   docker-compose:latest \ # the image we are running. the container we pulled down with docker pull
   up
```

```bash
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$PWD:$PWD" \
  -w="$PWD" \
  lscr.io/linuxserver/docker-compose:latest \
  up
```

## these apps work

The way they built the nginx apps seems to be breaking our docker compose solution

here is a list of ones that works:

- wordpress
- promotheuas/ grafana
- postgresql/ pgadmin
- plex

## some things to try

You will need to open two terminals. I could not figure out a way to stop a container with opening a second terminal.

- docker stop <container name>
- docker rm -f <container name>
- docker logs <container name>
- docker exec -it <container name>
- docker ps
