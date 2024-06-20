## Compose sample application

### Alfresco Community

Project structure:
```
.
├── README.md
└── compose.yaml
```

[_compose.yaml_](compose.yaml)
```
  postgres:
    volumes:
      - postgres-data:/var/lib/postgresql/data

  activemq:
    volumes:
      - activemq-data:/opt/activemq/data

  transform-core-aio:
    depends_on: 
      activemq:
        condition: service_healthy

  alfresco:
    depends_on: 
      postgres:
        condition: service_healthy
      activemq:
        condition: service_healthy
      transform-core-aio:
        condition: service_healthy
    volumes:
      - alf-repo-data:/usr/local/tomcat/alf_data

  solr6:
    depends_on:
      alfresco:
        condition: service_healthy
    volumes:
      - solr-data:/opt/alfresco-search-services/data

  share:
    depends_on: 
      alfresco:
        condition: service_healthy

  content-app:
    depends_on: 
      alfresco:
        condition: service_healthy

  control-center:
    depends_on: 
      alfresco:
        condition: service_healthy

  proxy:
    depends_on:
      share:
        condition: service_started
      content-app:
        condition: service_started
      control-center:
        condition: service_started
      alfresco:
        condition: service_started

volumes:
  activemq-data:
  postgres-data:
  alf-repo-data:
  solr-data:
```

This Docker Compose configuration defines a set of services to deploy [Alfresco Community](https://github.com/alfresco/alfresco-docker-installer).

**Services**

* `postgres`: This service defines a database container
* `activemq`: This service defines a message broker container
* `transform-core-aio`: This service defines a document format transformer and it depends on the `activemq` service
* `alfresco`: This service defines a content service platform and it depends on `postgres`, `activemq`, and `transform-core-aio`
* `solr6`: This service defines a search engine and it depends on the `alfresco`
* `share`, `content-app`, `control-center`: These services define the UI layer and they depend on the `alfresco` service
* `proxy`: This service defines a web proxy and it depends on `share`, `content-app`, `control-center`, and `alfresco`

**Volumes**

* The configuration defines persistent storage volumes for each service that needs to maintain data across container restarts

## Deploy with docker compose

```
$ docker compose up -d
[+] Running 9/9
 ✔ Network alfresco_default                           Created0.0s    0.1s
 ⠙ Container alfresco-activemq-1                      Starting0.3s   0.0s
 ⠙ Container alfresco-postgres-1                      Starting0.3s   0.1s
 ✔ Container alfresco-transform-core-aio-1            Created0.0s    0.1s
 ✔ Container alfresco-alfresco-1                      Created0.0s
...
```

## Expected result

Listing containers must show containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID   IMAGE                                                   COMMAND                  CREATED         STATUS                   PORTS                                      NAMES
55468f6509b9   alfresco/alfresco-acs-nginx:3.4.2                       "/entrypoint.sh"         4 minutes ago   Up 3 minutes             80/tcp, 0.0.0.0:8080->8080/tcp             alfresco-proxy-1
845a7c1bf80f   alfresco/alfresco-search-services:2.0.10                "/bin/sh -c '$DIST_D…"   4 minutes ago   Up 3 minutes             8983/tcp, 10001/tcp                        alfresco-solr6-1
89909bffca8c   alfresco/alfresco-share:23.2.1                          "/usr/local/tomcat/s…"   4 minutes ago   Up 3 minutes             8000/tcp, 8080/tcp                         alfresco-share-1
f1bcbf762b9f   alfresco/alfresco-content-app:4.4.1                     "/docker-entrypoint.…"   4 minutes ago   Up 3 minutes             8080/tcp                                   alfresco-content-app-1
f68d0d9ceda6   quay.io/alfresco/alfresco-control-center:8.4.1          "/docker-entrypoint.…"   4 minutes ago   Up 3 minutes             8080/tcp                                   alfresco-control-center-1
d479afe64ed2   alfresco/alfresco-content-repository-community:23.2.1   "catalina.sh run -se…"   4 minutes ago   Up 4 minutes (healthy)   8000/tcp, 8080/tcp, 10001/tcp              alfresco-alfresco-1
dda9d0606e47   alfresco/alfresco-transform-core-aio:5.1.2              "/docker-entrypoint.…"   4 minutes ago   Up 4 minutes (healthy)   8090/tcp                                   alfresco-transform-core-aio-1
a23484408ad9   postgres:15.7                                           "docker-entrypoint.s…"   4 minutes ago   Up 4 minutes (healthy)   5432/tcp                                   alfresco-postgres-1
a8349f39b56b   alfresco/alfresco-activemq:5.18-jre17-rockylinux8       "/bin/sh -c './init.…"   4 minutes ago   Up 4 minutes (healthy)   5672/tcp, 8161/tcp, 61613/tcp, 61616/tcp   alfresco-activemq-1
```

After the application starts, UI applications are available in the following endpoints using default credentials `admin`/`admin`:

* Legacy UI: `http://localhost:8080/share`
* Modern UI: `http://localhost:8080/content-app`
* Management UI: `http://localhost:8080/admin`

Stop and remove the containers
```
$ docker compose down
 ✔ Container alfresco-solr6-1               Removed
 ✔ Container alfresco-proxy-1               Removed
 ✔ Container alfresco-share-1               Removed
 ✔ Container alfresco-content-app-1         Removed
 ✔ Container alfresco-control-center-1      Removed
 ✔ Container alfresco-alfresco-1            Removed
 ✔ Container alfresco-postgres-1            Removed
 ✔ Container alfresco-transform-core-aio-1  Removed
 ✔ Container alfresco-activemq-1            Removed
 ✔ Network alfresco_default                 Removed
```

If you want to stop and remove both containers and volumes use following command:

```
$ docker compose down -v
 ✔ Container alfresco-solr6-1               Removed
 ✔ Container alfresco-proxy-1               Removed
 ✔ Container alfresco-share-1               Removed
 ✔ Container alfresco-content-app-1         Removed
 ✔ Container alfresco-control-center-1      Removed
 ✔ Container alfresco-alfresco-1            Removed
 ✔ Container alfresco-transform-core-aio-1  Removed
 ✔ Container alfresco-postgres-1            Removed
 ✔ Container alfresco-activemq-1            Removed
 ✔ Volume alfresco_postgres-data            Removed
 ✔ Volume alfresco_solr-data                Removed
 ✔ Volume alfresco_alf-repo-data            Removed
 ✔ Volume alfresco_activemq-data            Removed
 ✔ Network alfresco_default                 Removed
```