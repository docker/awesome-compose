# Umbraco CMS Docker compose file

This sample project will start up the [Umbraco CMS](https://github.com/umbraco/Umbraco-CMS/) in a Docker container, with an attached database container running SQL Server. This site also uses a template starter kit which is built on the Portfolio demo from Paul Seal

Project structure:
```
.
├── app
│   ├── umbracocms
|   │   ├── Dockerfile
|   |   └── ...
│   └── umbraco.sln
└── compose.yaml
```

[_compose.yaml_](compose.yaml)
```
services:
  web:
    build: app/umbracocms
    ports:
      - 8000:80
    restart: always
    volumes:
     - umbraco-media:/app/wwwroot/media     
     - umbraco-logs:/app/umbraco/Logs     
     
volumes:
  umbraco-media:
  umbraco-logs:
```

This compose file defines the umbraco application. In this instance it's configured in the simplest way possible, using an SQLite database. This is not a recommended configuration for production use, but is good for demos. 

The site uses 2 volumes, one for media, where images are stored, and one for Logs, so logs can be viewed even when the container is stopped.

The application is configured to run on port 8000, so when the container is running you can run the site on http://localhost:8000.

## Deploy with docker compose

```
$ docker compose up -d
```

## Credentials

When the site is up and running, you can log in with the following credentials:

- Login URL : http://localhost:8000/umbraco/
- Username : hello@umbraco.com
- Password : 1234567890

If you want to browse the front end of the site, you can use : http://localhost:8000

![page](media/umbraco_sample.jpeg)

Stop and remove the containers

```
$ docker compose down
```