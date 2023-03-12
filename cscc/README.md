# How to run these examples in the CSCC VMs

To run these examples, we need a newer version of docker compose.

```bash

docker run --rm \
   --volume /var/run/docker.sock:/var/run/docker.sock \ #bind mounts a volume. This mounts the docker.sock on your VM to the docker.sock in the container
   --volume "$PWD:$PWD" \ # this bind mounts the current path, to the working directory in docker compose container
   --workdir="$PWD" \ #sets the working directory to the default path in the container
   docker/compose \ # the image we are running. the container we pulled down with docker pull
   -f docker-compose.yml \ # This is within the container. Telling the process to use the docker-compose.yaml file we gave it
   up
```

```bash
docker run --rm \
   --volume /var/run/docker.sock:/var/run/docker.sock \
   --volume "$PWD:$PWD" \ 
   --workdir="$PWD" \ 
   docker/compose \ 
   -f docker-compose.yml \ 
   up
```
