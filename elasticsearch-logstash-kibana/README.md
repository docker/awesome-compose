## Compose sample application
### Elasticsearch, Logstash, and Kibana (ELK) in single-node

Project structure:
```
.
└── compose.yaml
```

[_compose.yaml_](compose.yaml)
```
services:
  elasticsearch:
    image: elasticsearch:9.5.5
    ...
  logstash:
    image: logstash:9.5.5
    ...
  kibana:
    image: kibana:9.5.5
    ...
```

## Deploy with docker compose

```
$ docker compose up -d
Creating network "elasticsearch-logstash-kibana_elastic" with driver "bridge"
Creating es ... done
Creating log ... done
Creating kib ... done
```

## Expected result

Listing containers must show three containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                 COMMAND                  CREATED             STATUS                    PORTS                                                                                            NAMES
173f0634ed33        logstash:9.5.5        "/usr/local/bin/dock…"   43 seconds ago      Up 41 seconds             0.0.0.0:5000->5000/tcp, 0.0.0.0:5044->5044/tcp, 0.0.0.0:9600->9600/tcp, 0.0.0.0:5000->5000/udp   log
b448fd3e9b30        kibana:9.5.5          "/usr/local/bin/dumb…"   43 seconds ago      Up 42 seconds             0.0.0.0:5601->5601/tcp                                                                           kib
366d358fb03d        elasticsearch:9.5.5   "/tini -- /usr/local…"   43 seconds ago      Up 42 seconds (healthy)   0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp                                                   es
```

After the application starts, navigate to below links in your web browser:

* Elasticsearch: [`http://localhost:9200`](http://localhost:9200)
* Logstash: [`http://localhost:9600`](http://localhost:9600)
* Kibana: [`http://localhost:5601/api/status`](http://localhost:5601/api/status)

Stop and remove the containers
```
$ docker compose down
```

## Attribution

The [example Nginx logs](https://github.com/docker/awesome-compose/tree/master/elasticsearch-logstash-kibana/logstash/nginx.log) are copied from [here](https://github.com/elastic/examples/blob/master/Common%20Data%20Formats/nginx_json_logs/nginx_json_logs).
