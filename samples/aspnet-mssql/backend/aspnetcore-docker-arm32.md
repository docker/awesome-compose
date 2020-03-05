# Use ASP.NET Core on Linux ARM32 with Docker

You can use ASP.NET Core and Docker together on [ARM32](https://en.wikipedia.org/wiki/ARM_architecture) devices, with [Docker for Raspberry Pi and ARM32 devices](https://docs.docker.com/install/linux/docker-ce/debian).

> Note: that Docker refers to ARM32 as `armhf` in documentation and other places.

See [Use .NET Core on Linux ARM32 with Docker](../dotnetapp/aspnetcore-docker-arm32.md) for .NET Core console apps.

See [.NET Core and Docker for ARM64](dotnet-docker-arm64.md) if you are interested in [ARM64](https://en.wikipedia.org/wiki/ARM64) usage.

## Try a pre-built ASP.NET Core Docker Image

You can quickly run a container with a pre-built [sample ASP.NET Core Docker image](https://hub.docker.com/r/microsoft/dotnet-samples/), based on this [sample](Dockerfile.preview).

Type the following command to run a sample with [Docker](https://www.docker.com/products/docker):

```console
docker run --rm -it -p 8000:80 microsoft/dotnet-samples:aspnetapp
```

After the application starts, navigate to `http://localhost:8000` in your web browser and/or to the IP address (example: http://192.168.1.18:8000) of your ARM32 device on your network.

## Building .NET Core Samples with Docker

You can build the same [.NET Core console samples](README.md) and [ASP.NET Core sample](../aspnetapp/README.md) on ARM devices as you can on other architectures. For example, the following instructions will work on an ARM32 device. The instructions assume that you are in the root of this repository.

```console
cd samples
cd aspnetapp
docker build --pull -t aspnetapp .
docker run --rm -it -p 8000:80 aspnetapp
```

Another option is to build ARM32 Docker images on an X64 machine. You can do by using the same pattern used in the [Dockerfile.debian-arm32-selfcontained](../dotnetapp/Dockerfile.debian-arm32-selfcontained) dockerfile. It uses a multi-arch tag for building with the SDK and then an ARM32-specific tag for creating a runtime image. The pattern of building for other architectures only works because the Dockerfile doesn't run code in the runtime image.

### Viewing the Site

After the application starts, visit the site one of two ways:

* From the web browser on the ARM32 device at `http://localhost:8000`
* From the web browser on another device on the same network on the ARM32 device IP on port 8000, similar to: `http://192.168.1.18:8000`

You must set the `ASPNETCORE_URLS` environment variable manually ([example usage](https://github.com/dotnet/dotnet-docker/blob/master/2.1/runtime-deps/stretch-slim/arm32v7/Dockerfile#L19)) if you build the sample locally (without Docker) and want to navigate to the site from another machine.

## Pushing the image to a Container Registry

Push the image to a container registry after building the image so that you can pull it from another ARM32 device. You can also build an ARM32 image on an X64 machine, push to a registry and then pull from an ARM32 device. Instructions are provided for pushing to both Azure Container Registry and DockerHub (you only need to choose one):

* [Push Docker Images to Azure Container Registry](push-image-to-acr.md)
* [Push Docker Images to DockerHub](push-image-to-dockerhub.md)

## More Samples

* [.NET Core Docker Samples](../README.md)
* [.NET Framework Docker Samples](https://github.com/microsoft/dotnet-framework-docker-samples/)
