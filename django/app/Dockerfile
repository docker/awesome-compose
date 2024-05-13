# syntax=docker/dockerfile:1.4

FROM python:3.7-alpine AS builder
EXPOSE 8000
WORKDIR /app 
COPY requirements.txt /app
RUN pip3 install -r requirements.txt --no-cache-dir
COPY . /app 
ENTRYPOINT ["python3"] 
CMD ["manage.py", "runserver", "0.0.0.0:8000"]

FROM builder as dev-envs
RUN apk update && \
apk add git && \
addgroup -S docker && \
adduser -S --shell /bin/bash --ingroup docker vscode
# install Docker tools (cli, buildx, compose)
COPY --from=gloursdocker/docker /app /app
CMD ["manage.py", "runserver", "0.0.0.0:8000"]
