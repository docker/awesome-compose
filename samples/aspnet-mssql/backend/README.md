# ASP.NET Core Docker Sample

This [sample Dockerfile](Dockerfile) demonstrates how to use ASP.NET Core and Docker together. The sample works with both Linux and Windows containers and can also be used without Docker. There are also instructions that demonstrate how to push the sample to [Azure Container Registry](../dotnetapp/push-image-to-acr.md) and test it with [Azure Container Instance](deploy-container-to-aci.md). You can [configure ASP.NET Core to use HTTPS with Docker](aspnetcore-docker-https.md).

The sample builds the application in a container based on the larger [.NET Core SDK Docker image](https://hub.docker.com/r/microsoft/dotnet/). It builds the application and then copies the final build result into a Docker image based on the smaller [ASP.NET Core Docker Runtime image](https://hub.docker.com/r/microsoft/aspnetcore/).

This sample requires [Docker 17.06](https://docs.docker.com/release-notes/docker-ce) or later of the [Docker client](https://www.docker.com/products/docker).

## Try a pre-built ASP.NET Core Docker Image

You can quickly run a container with a pre-built [sample ASP.NET Core Docker image](https://hub.docker.com/r/microsoft/dotnet-samples/), based on this [sample](Dockerfile).

Type the following command to run a sample with [Docker](https://www.docker.com/products/docker):

```console
docker run --name aspnetcore_sample --rm -it -p 8000:80 microsoft/dotnet-samples:aspnetapp
```

After the application starts, navigate to `http://localhost:8000` in your web browser. On Windows, you may need to navigate to the container via IP address. See [ASP.NET Core apps in Windows Containers](aspnetcore-docker-windows.md) for instructions on determining the IP address, using the value of `--name` that you used in `docker run`.

See [Hosting ASP.NET Core Images with Docker over HTTPS](aspnetcore-docker-https.md) to use HTTPS with this image.

## Getting the sample

The easiest way to get the sample is by cloning the samples repository with git, using the following instructions:

```console
git clone https://github.com/dotnet/dotnet-docker/
```

You can also [download the repository as a zip](https://github.com/dotnet/dotnet-docker/archive/master.zip).

## Build and run the sample with Docker

You can build and run the sample in Docker using the following commands. The instructions assume that you are in the root of the repository.

```console
cd samples
cd aspnetapp
docker build --pull -t aspnetapp .
docker run --name aspnetcore_sample --rm -it -p 8000:80 aspnetapp
```

You should see the following console output as the application starts.

```console
C:\git\dotnet-docker\samples\aspnetapp>docker run --name aspnetcore_sample --rm -it -p 8000:80 aspnetapp
Hosting environment: Production
Content root path: /app
Now listening on: http://[::]:80
Application started. Press Ctrl+C to shut down.
```

After the application starts, navigate to `http://localhost:8000` in your web browser. On Windows, you may need to navigate to the container via IP address. See [ASP.NET Core apps in Windows Containers](aspnetcore-docker-windows.md) for instructions on determining the IP address, using the value of `--name` that you used in `docker run`.

> Note: The `-p` argument maps port 8000 on your local machine to port 80 in the container (the form of the port mapping is `host:container`). See the [Docker run reference](https://docs.docker.com/engine/reference/commandline/run/) for more information on commandline parameters. In some cases, you might see an error because the host port you select is already in use. Choose a different port in that case.

## Additional Samples

Multiple variations of this sample have been provided, as follows. Some of these example Dockerfiles are demonstrated later. Specify an alternate Dockerfile via the `-f` argument.

* [Multi-arch sample](Dockerfile)
* [Multi-arch sample, using a preview version of .NET Core](Dockerfile.preview)
* [Nanoserver 2016 SAC sample](Dockerfile.nanoserver-sac2016)
* [Alpine sample](Dockerfile.alpine-x64)

## Deploying with HTTPS

ASP.NET Core 2.1 uses [HTTPS by default](https://docs.microsoft.com/en-us/aspnet/core/security/enforcing-ssl). You can [configure ASP.NET Core to use HTTPS with Docker](aspnetcore-docker-https.md).

## Build and run the sample for Alpine X64 with Docker

You can build and run the sample for Alpine using the following instructions. Make sure Docker is set to Linux containers if you are on Windows.

```console
cd samples
cd aspnetapp
docker build --pull -t aspnetapp -f Dockerfile.alpine-x64 .
docker run --name aspnetcore_sample --rm -it -p 8000:80 aspnetapp
```

After the application starts, navigate to `http://localhost:8000` in your web browser.

## Build and run the sample for Ubuntu 18.04 with Docker

You can also build for [Ubuntu 18.04](https://hub.docker.com/_/ubuntu/), with a `bionic` tag. The `bionic` tags are documented at [microsoft/dotnet](https://hub.docker.com/r/microsoft/dotnet/). You would switch to the following tags:

* SDK: 2.1-sdk-bionic
* Runtime:-2.1-aspnetcore-runtime-bionic

## Build and run the sample for Linux ARM32 with Docker

You can build and run the sample for ARM32 and Raspberry Pi with [Build ASP.NET Core Applications for Raspberry Pi with Docker](aspnetcore-docker-arm32.md) instructions.

## Develop ASP.NET Core Applications in a container

You can develop applications without a .NET Core installation on your machine with the [Develop ASP.NET Core applications in a container](aspnet-docker-dev-in-container.md) instructions. These instructions are also useful if your development and production environments do not match.

## Deploying to Production vs Development

The approach for running containers differs between development and production.

In production, you will typically start your container with `docker run -d`. This argument starts the container as a service, without any console interaction. You then interact with it through other Docker commands or APIs exposed by the containerized application.

In development, you will typically start containers with `docker run --rm -it`. These arguments enable you to see a console (important when there are errors), terminate the container with `CTRL-C` and cleans up all container resources when the container is termiantes. You also typically don't mind blocking the console. This approach is demonstrated in prior examples in this document.

We recommend that you do not use `--rm` in production. It cleans up container resources, preventing you from collecting logs that may have been captured in a container that has either stopped or crashed.

## Build and run the sample locally

You can build and run the sample locally with the [.NET Core 2.1 SDK](https://www.microsoft.com/net/download/core) using the following commands. The commands assume that you are in the root of the repository.

```console
cd samples
cd aspnetapp
dotnet run
```

After the application starts, visit `http://localhost:5000` in your web browser.

You can produce an application that is ready to deploy to production locally using the following command.

```console
dotnet publish -c Release -o out
```

You can run the application using the following commands.

```console
cd out
dotnet aspnetapp.dll
```

Note: The `-c Release` argument builds the application in release mode (the default is debug mode). See the [dotnet publish reference](https://docs.microsoft.com/dotnet/core/tools/dotnet-publish) for more information on commandline parameters.

## .NET Core Resources

More Samples

* [.NET Core Docker Samples](../README.md)
* [.NET Framework Docker Samples](https://github.com/microsoft/dotnet-framework-docker/blob/master/samples/README.md)

Docs and More Information:

* [.NET Docs](https://docs.microsoft.com/dotnet/)
* [ASP.NET Docs](https://docs.microsoft.com/aspnet/)
* [dotnet/core](https://github.com/dotnet/core) for starting with .NET Core on GitHub.
* [dotnet/announcements](https://github.com/dotnet/announcements/issues) for .NET announcements.

## Related Repositories

.NET Core Docker Hub repos:

* [microsoft/aspnetcore](https://hub.docker.com/r/microsoft/aspnetcore/) for ASP.NET Core images.
* [microsoft/dotnet](https://hub.docker.com/r/microsoft/dotnet/) for .NET Core images.
* [microsoft/dotnet-nightly](https://hub.docker.com/r/microsoft/dotnet-nightly/) for .NET Core preview images.
* [microsoft/dotnet-samples](https://hub.docker.com/r/microsoft/dotnet-samples/) for .NET Core sample images.

.NET Framework Docker Hub repos:

* [microsoft/aspnet](https://hub.docker.com/r/microsoft/aspnet/) for ASP.NET Web Forms and MVC images.
* [microsoft/dotnet-framework](https://hub.docker.com/r/microsoft/dotnet-framework/) for .NET Framework images.
* [microsoft/dotnet-framework-samples](https://hub.docker.com/r/microsoft/dotnet-framework-samples/) for .NET Framework and ASP.NET sample images.
