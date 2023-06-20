# Sample apps with Compose

The following samples show the various aspects of how to work with Docker
Compose. As a prerequisite, be sure to [install Docker Compose](https://docs.docker.com/compose/install/)
if you have not already done so.

## Key concepts these samples cover

The samples should help you to:

- define services based on Docker images using
  [Compose files](https://docs.docker.com/compose/compose-file/) `docker-compose.yml` files
- understand the relationship between `docker-compose.yml` and
  [Dockerfiles](https://docs.docker.com/engine/reference/builder/)
- learn how to make calls to your application services from Compose files

## Samples tailored to demo Compose

These samples focus specifically on Docker Compose:

- [Quickstart: Compose and Django](./django/README.md) - Shows how to use Docker Compose to set up and run a simple Django/PostgreSQL app.

- [Quickstart: Compose and Rails](./rails/README.md) - Shows how to use
Docker Compose to set up and run a Rails/PostgreSQL app.

- [Quickstart: Compose and WordPress](./wordpress/README.md) - Shows how to
use Docker Compose to set up and run WordPress in an isolated environment
with Docker containers.
