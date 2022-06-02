# Umbraco CMS Docker compose file

This sample project will start up the [Umbraco CMS](https://github.com/umbraco/Umbraco-CMS/) in a Docker container, with an attached database container running SQL Server. 

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
    build: app
    ports:
    - 80:80
  db:
    # mssql server image isn't available for arm64 architecture, so we use azure-sql instead
    image: mcr.microsoft.com/azure-sql-edge:1.0.4
    # If you really want to use MS SQL Server, uncomment the following line
    #image: mcr.microsoft.com/mssql/server
    ...
```


## Credentials

hello@umbraco.com
1234567890



## crap below

docker build --tag=umbracocms .\umbracocms

docker run --name umbracocms -p 8000:80 -v umbraco-media:/app/wwwroot/media -v umbraco-logs:/app/umbraco/Logs -e -d umbracocms

docker run --name umbraco -p 8000:80 -d umbracodotnet 