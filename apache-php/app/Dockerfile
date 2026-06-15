# syntax=docker/dockerfile:1.4

FROM --platform=$BUILDPLATFORM php:8.0.9-apache as builder

CMD ["apache2-foreground"]

FROM builder as dev-envs

RUN apt update && \
apt install -y --no-install-recommends git 

RUN
useradd -s /bin/bash -m vscode && \
groupadd docker && \
usermod -aG docker vscode
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /

CMD ["apache2-foreground"]
