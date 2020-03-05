# Develop ASP.NET Core Applications in a Container

You can use containers to establish a .NET Core development environment with only Docker and optionally a code editor installed on your machine. The environment can be made to match your local machine, production or both. If you support multiple operating systems, then this approach might become a key part of your development process.

A common use case of Docker is to [containerize an application](README.md). You can define the environment necessary to run the application and even build the application itself within a Dockerfile. This document describes a much more iterative and dynamic use of Docker, defining the container environment primarily via the commandline. .NET Core includes a command called `dotnet watch` that can rerun your application or your tests on each code change. This document describes how to use the Docker CLI and `dotnet watch` to develop applications in a container.

See [Develop .NET Core Applications in a Container](../dotnetapp/dotnet-docker-dev-in-container.md) for .NET Core-specific instructions.

## Getting the sample

The easiest way to get the sample is by cloning the samples repository with [git](https://git-scm.com/downloads), using the following instructions:

```console
git clone https://github.com/dotnet/dotnet-docker/
```

You can also [download the repository as a zip](https://github.com/dotnet/dotnet-docker/archive/master.zip).

## Requirements

It is recommended that you add a [Directory.Build.props](Directory.Build.props) file to your project to use different `obj` and `bin` folders for local and container use, to avoid conflicts between them. You should delete your existing obj and bin folders before making this change. You can also use `dotnet clean` for this purpose.

This approach relies on [volume mounting](https://docs.docker.com/engine/admin/volumes/volumes/) (that's the `-v` argument in the following commands) to mount source into the container (without using a Dockerfile). You may need to [Enable shared drives (Windows)](https://docs.docker.com/docker-for-windows/#shared-drives) or [file sharing (macOS)](https://docs.docker.com/docker-for-mac/#file-sharing) first.

## Run your application in a container while you Develop

You can re-run your application in a container with every local code change. This scenario works for both console applications and websites. The syntax differs a bit for Windows and Linux containers.

The instructions assume that you are in the root of the repository. You can use the following commands, given your environment:

### Windows using Linux containers

```console
docker run --rm -it -p 8000:80 -v c:\git\dotnet-docker\samples\aspnetapp:/app/ -w /app/aspnetapp microsoft/dotnet:2.1-sdk dotnet watch run
```

You can use CTRL-C to terminate `dotnet watch`. Navigate to the site at `http://localhost:8000` in your browser.

### macOS or Linux using Linux containers

```console
docker run --rm -it -p 8000:80 -v ~/git/dotnet-docker/samples/aspnetapp:/app/ -w /app/aspnetapp microsoft/dotnet:2.1-sdk dotnet watch run
```

You can use CTRL-C to terminate `dotnet watch`. Navigate to the site at `http://localhost:8000` in your browser.

### Windows using Windows containers

```console
docker run --rm -it -p 8000:80 -v c:\git\dotnet-docker\samples\aspnetapp:c:\app\ -w \app\aspnetapp --name aspnetappsample microsoft/dotnet:2.1-sdk dotnet watch run
```

You can use CTRL-C to terminate `dotnet watch`.

After the application starts, navigate to `http://localhost:8000` in your web browser. On Windows, you may need to navigate to the container via IP address. See [ASP.NET Core apps in Windows Containers](aspnetcore-docker-windows.md) for instructions on determining the IP address, using the value of `--name` that you used in `docker run`.

## Updating the site while the container is running

You can demo a relaunch of the site by changing the About controller method in `HomeController.cs`, waiting a few seconds for the site to recompile and then visit `http://localhost:8000/Home/About`

## Test your application in a container while you develop

You can retest your application in a container with every local code change. You can see this demonstrated in [Develop .NET Core Applications in a Container](../dotnetapp/dotnet-docker-dev-in-container.md).

## More Samples

* [.NET Core Docker Samples](../README.md)
* [.NET Framework Docker Samples](https://github.com/microsoft/dotnet-framework-docker-samples/)
