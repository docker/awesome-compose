# ASP.NET Core apps in Windows Containers

ASP.NET Core applications are supported with [Windows containers](https://docs.microsoft.com/virtualization/windowscontainers/). The following instructions demonstrate how to run ASP.NET Core with Windows containers. See [ASP.NET Core Docker Sample](README.md) for instructions on how to build container images with ASP.NET Core.

## Try a pre-built ASP.NET Core Docker Image

You can quickly run a container with a pre-built [sample ASP.NET Core Docker image](https://hub.docker.com/r/microsoft/dotnet-samples/), based on this [sample](Dockerfile).

Type the following command to run a sample with [Docker](https://store.docker.com/editions/community/docker-ce-desktop-windows):

```console
docker run --name aspnetcore_sample --rm -it -p 8000:80 microsoft/dotnet-samples:aspnetapp
```

After the application starts, navigate to `http://localhost:8000` in your web browser. In some scenarios, and with earlier versions of Windows, you need to access the container via IP address. See the following section for instructions on how to do that.

## View ASP.NET Core apps via IP address

After the ASP.NET Core application starts, navigate to the container IP in your web browser with the the following instructions:

> Note: These instructions rely on using the `--name aspnetcore_sample` argument with `docker run`. The `--name` argument makes it possible to access the container by name. If you used a different name, then use it instead in the following steps.

1. Open up a command prompt.
1. Run `docker exec aspnetcore_sample ipconfig`.
1. Copy the container IP address and paste into your browser (for example, `172.29.245.43`).

See the following example of how to get the IP address of a running Windows container.

```console
C:\git\dotnet-docker\samples\aspnetapp>docker exec aspnetcore_sample ipconfig

Windows IP Configuration


Ethernet adapter Ethernet:

   Connection-specific DNS Suffix  . : contoso.com
   Link-local IPv6 Address . . . . . : fe80::1967:6598:124:cfa3%4
   IPv4 Address. . . . . . . . . . . : 172.29.245.43
   Subnet Mask . . . . . . . . . . . : 255.255.240.0
   Default Gateway . . . . . . . . . : 172.29.240.1
```

Note: [`docker exec`](https://docs.docker.com/engine/reference/commandline/exec/) supports identifying containers with name or hash. The container name is used in the preceding instructions. `docker exec` runs a new command (as opposed to the [entrypoint](https://docs.docker.com/engine/reference/builder/#entrypoint)) in a running container.

`docker inspect` can also be used for this same purpose, as demonstrated in the following example.

```console
C:\git\dotnet-docker\samples\aspnetapp>docker inspect -f "{{ .NetworkSettings.Networks.nat.IPAddress }}" aspnetcore_sample
172.25.157.148
```