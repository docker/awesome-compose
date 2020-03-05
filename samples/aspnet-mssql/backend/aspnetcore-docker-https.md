# Hosting ASP.NET Core Images with Docker over HTTPS

ASP.NET Core 2.1 uses [HTTPS by default](https://docs.microsoft.com/aspnet/core/security/enforcing-ssl). [HTTPS](https://en.wikipedia.org/wiki/HTTPS) relies on [certificates](https://en.wikipedia.org/wiki/Public_key_certificate) for trust, identity, and encryption.

This document explains how to run pre-built container images with HTTPS.

See [Developing ASP.NET Core Applications with Docker over HTTPS](aspnetcore-docker-https-development.md) for development scenarios.

This sample requires [Docker 17.06](https://docs.docker.com/release-notes/docker-ce) or later of the [Docker client](https://www.docker.com/products/docker).

## Certificates

You need a certificate from a [certificate authority](https://en.wikipedia.org/wiki/Certificate_authority) for [production hosting](https://blogs.msdn.microsoft.com/webdev/2017/11/29/configuring-https-in-asp-net-core-across-different-platforms/) for your domain. You may already have one. [Let's Encrypt](https://letsencrypt.org/) is a certificate authority that offers free certificates.

This document uses [self-signed development certificates](https://en.wikipedia.org/wiki/Self-signed_certificate) for hosting pre-built images over `localhost`. The instructions are similar to using production certificates.

For production certs, you do not need to use the `dotnet dev-certs` tool or store the certificates in the location used in the instructions. Any location should work, although storing certs within your site directory is an anti-pattern.

The instructions volume mount certificates into containers. You can add certificates into container images with a `COPY` command in a Dockerfile. Copying certificates into an image is an anti-pattern. It makes it harder to use the same image for testing with dev certificates and hosting with production certificates. There is also a  significant risk of certificate disclosure if certificates are made part of container images.

## Running pre-built Container Images with HTTPS

Use the following instructions, for your operating system configuration.

You need the [.NET Core 2.1 SDK](https://www.microsoft.com/net/download) for some of the instructions.

### Windows using Linux containers

Generate cert and configure local machine:

```console
dotnet dev-certs https -ep %USERPROFILE%\.aspnet\https\aspnetapp.pfx -p crypticpassword
dotnet dev-certs https --trust
```

> Note: `crypticpassword` is used as a stand-in for a password of your own choosing.

Run the container image with ASP.NET Core configured for HTTPS:

```console
docker pull microsoft/dotnet-samples:aspnetapp
docker run --rm -it -p 8000:80 -p 8001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=8001 -e ASPNETCORE_Kestrel__Certificates__Default__Password="crypticpassword" -e ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx -v %USERPROFILE%\.aspnet\https:/https/ microsoft/dotnet-samples:aspnetapp
```

> Note: The password must match the password used for the certificate.

### macOS or Linux

Generate cert and configure local machine:

```console
dotnet dev-certs https -ep ${HOME}/.aspnet/https/aspnetapp.pfx -p crypticpassword
dotnet dev-certs https --trust
```

> Note: `dotnet dev-certs https --trust` is only supported on macOS and Windows. You need to trust certs on Linux in the way that is supported by your distro. It is likely that you need to trust the certificate in your browser.

> Note: `crypticpassword` is used as a stand-in for a password of your own choosing.

Run the container image with ASP.NET Core configured for HTTPS:

```console
docker pull microsoft/dotnet-samples:aspnetapp
docker run --rm -it -p 8000:80 -p 8001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=8001 -e ASPNETCORE_Kestrel__Certificates__Default__Password="crypticpassword" -e ASPNETCORE_Kestrel__Certificates__Default__Path=/https/aspnetapp.pfx -v ${HOME}/.aspnet/https:/https/ microsoft/dotnet-samples:aspnetapp
```

> Note: The password must match the password used for the certificate.

### Windows using Windows containers

Generate cert and configure local machine:

```console
dotnet dev-certs https -ep %USERPROFILE%\.aspnet\https\aspnetapp.pfx -p crypticpassword
dotnet dev-certs https --trust
```

> Note: `crypticpassword` is used as a stand-in for a password of your own choosing.

Run the container image with ASP.NET Core configured for HTTPS:

```console
docker pull microsoft/dotnet-samples:aspnetapp
docker run --rm -it -p 8000:80 -p 8001:443 -e ASPNETCORE_URLS="https://+;http://+" -e ASPNETCORE_HTTPS_PORT=8001 -e ASPNETCORE_Kestrel__Certificates__Default__Password="crypticpassword" -e ASPNETCORE_Kestrel__Certificates__Default__Path=\https\aspnetapp.pfx -v %USERPROFILE%\.aspnet\https:C:\https\ microsoft/dotnet-samples:aspnetapp
```

> Note: The password must match the password used for the certificate.
