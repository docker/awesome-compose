# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:6.0 AS base

WORKDIR /src

COPY aspnetapp.csproj ./
RUN ["dotnet", "restore"]

FROM base as builder

COPY . .

CMD ["dotnet", "build", "-c", "-o", "/build"]

FROM builder AS publisher

RUN ["dotnet", "publish", "-c", "Release", "-o", "/build"]

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app
COPY --from=publisher /build .

CMD ["dotnet", "aspnetapp.dll"]
