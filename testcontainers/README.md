# Docker Compose Testcontainers

## Why Testcontainers?

Testcontainers is a tool for creating lightweight, throwaway instances of common databases or anything that can run in a Docker container. In addition to testing, you can leverage the Testcontainers [Docker Compose Feature](https://node.testcontainers.org/features/compose/) to perform **local development** in scenarios where you cannot install the Docker engine or need **cloud workloads** to offload resource-intensive tasks.

This example demonstrates how to use Testcontainers for a Node.js environment. With Testcontainers Desktop, you can develop against [Testcontainers Cloud](https://testcontainers.com/cloud/) or the [Testcontainers embedded runtime](https://newsletter.testcontainers.com/announcements/adopt-testcontainers-desktop-as-your-container-runtime-early-access) to see Testcontainers capabilities.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [Testcontainers Desktop](https://testcontainers.com/desktop/)

## Running the app

The app checks if the `REDIS_URL` environment variable is set. If so, it connects to the specified Redis instance. If `REDIS_URL` is not set, it uses testcontainers to create a Redis instance using the Docker Compose file `redis.yaml`. Simply run `npm run dev` to start the app.

Additionally you can also start this example without Testcontainers by setting the `REDIS_URL` environment variable to a Redis instance. This is already prepared in the `compose.yaml` file, so you can just run `docker compose up` to try it out.
