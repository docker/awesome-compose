# syntax = docker/dockerfile:1.4

FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9-slim AS builder

WORKDIR /app

COPY requirements.txt ./
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt

COPY ./app ./app

FROM builder as dev-envs

RUN apt update && \
apt install -y --no-install-recommends git

RUN useradd -s /bin/bash -m vscode && \
groupadd docker && \
usermod -aG docker vscode
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker / /
