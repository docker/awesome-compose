# Grafana-11.5-with-Prometheus-and-Docker-Compose
A Short Guide how to use Grafana 11.5 with Docker Compose. You will learn how to Provision Grafana so it comes with you Dashboards, Alerts, Datasources, Login, and Datasource-Configurations. 

Your team members can use Grafana with one command without going through the painful provision process.

***preview***
![grafik](https://github.com/user-attachments/assets/2c731b43-50e6-4c5b-868b-21b5143bc0e0)


- we will deploy grafana in combination with prometheus.
  - We will scrape the following containers:
    - redis
    - postgres


## Grafana Container Structure
![grafana_container_structure](https://github.com/user-attachments/assets/ac9cafe7-fcb0-47e6-8d40-6119b352888e)

The default folders for provisioning are in `/etc/grafana/`
 - the config file is stored under `/etc/grafana/grafana.ini`
 - the yml files for provisioning the dashboards, alerts, etc, are located in  `/etc/grafana/provisioning`
   - so far i had no luck copiying the entire folder to the container, so i needed to do this one by one

***we will use a similar folderstructure for provisioning***
```
grafana/
|-- grafana.ini
|-- ldap.toml
|-- provisioning/
    |-- access-control/
    |   |-- default.yml
    |-- alerting/
    |   |-- default.yml
    |-- dashboards/
    |   |-- default.yml
    |-- datasources/
    |   |-- default.yml
    |-- notifiers/
        |-- default.yml
    |-- my_dashboards/
        |-- postgres.json
        |-- redis.json
```
> create the folders accordingly in your project

 ## files for provisioning

 - create your files for provisioning
 - keep the folder structure, so you dont need to rename files


### dashboards
```yaml
apiVersion: 1
providers:
- name: 'default'
  orgId: 1
  folder: ''
  folderUid: ''
  type: file
  options:
    path: /home/grafana/dashboards/postgres.json
```
> ./grafana/provisioning/dashboards/default.yml

### datasources
> we hardcoded the ip in the compose file so we can use it here and no manual steps are required after the provisioning
```yaml
apiVersion: 1
datasources:
- name: Prometheus
  type: prometheus
  url: http://200.0.0.10:9090 
  isDefault: true
  access: proxy
  editable: true
```
> ./grafana/provisioning/datasources/default.yml

### file permissions
- after you created your files you need to set permissions accordingly, or grafana container might fail
  - cd to your root project folder
```bash
sudo chmod -R +x ./grafana
sudo chmod -R 775 ./grafana
sudo chown -R 1000:1000 ./grafana
```
- make sure to do the same for the prometheus.yml in the prometheus folder
> you can check permissions by using `ll -R`

- ***we can also set the paths were we want to copy our provisioning files to, by using environment variables:*** 

### Default paths && environment variables
from the grafana docs - [configure-docker](https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/)
> Grafana comes with default configuration parameters that remain the same among versions regardless of the operating system or the environmen
>
> The following configurations are set by default when you start the Grafana Docker container. When running in Docker you cannot change the configurations by editing the conf/grafana.ini file. Instead, you can modify the configuration using environment variables.

| Setting	| Default value | 
| --- |  --- |
| GF_PATHS_CONFIG	| /etc/grafana/grafana.ini |
| GF_PATHS_DATA	| /var/lib/grafana |
| GF_PATHS_HOME	| /usr/share/grafana |
| GF_PATHS_LOGS	| /var/log/grafana |
| GF_PATHS_PLUGINS	| /var/lib/grafana/plugins |
| GF_PATHS_PROVISIONING	| /etc/grafana/provisioning |

### environment variables
- add a .env file in your docker compose project directory to use values like  `${GRAFANA_PASSWORD}` in your docker compose file
```yml
DB_HOST=postgresql
DB_PORT=5432
DB_NAME=monitoring

DB_USERNAME=homestead
DB_PASSWORD=secret

PROMETHEUS_PORT=9090
GRAFANA_PORT=3000
GRAFANA_PASSWORD=secret
```

## docker compose file
> ***the example file:  [docker.compose.yml](https://github.com/user-attachments/assets/ac9cafe7-fcb0-47e6-8d40-6119b352888e)***
### prometheus ip
- notice that we hardcode a ip to prometheus, so  we can use it in the grafana datasources provisioning file
```yml
...
      networks:
        network1:
          ipv4_address: 200.0.0.10
```
### prometheus volumes
in order to define our exports (we will explain this later), we need to copy the prometheus.yml from `./prometheus/prometheus.yml` to `/etc/prometheus.yml`
```
volumes:
    - ./prometheus/prometheus.yml:/etc/prometheus.yml
```

### grafana volumes
-  1. we create the required grafana volume
-  2. we copy our user dashboards over to `/home/grafana/dashboards`
   3. we overwrite the grafana.ini config file in `/etc/grafana/grafana.ini`
   4. we create the default.yml for the dashboards in `/etc/grafana/provisioning/dashboards/default.yml`
   5. we create the default.yml for the datasources with the hardcoded prometheus ip in `/etc/grafana/provisioning/datasources/default.yml`
   6. we create the default.yml for the alerting
```yml
---
      volumes:
        - grafana:/var/lib/grafana
        - ./grafana/my_dashboards:/home/grafana/dashboards
        - ./grafana/defaults.ini:/etc/grafana/grafana.ini
        - ./grafana/provisioning/dashboards/default.yml:/etc/grafana/provisioning/dashboards/default.yml
        - ./grafana/provisioning/datasources/default.yml:/etc/grafana/provisioning/datasources/default.yml
        - ./grafana/provisioning/alerting/default.yml:/etc/grafana/provisioning/alerting/default.yml
```

### grafana environment variables in docker compose
- we can set certain grafana environment variables in the compose file
- the values for this can be set in the .env folder as we explained before
```yml
...
      environment:
          GF_SECURITY_ADMIN_PASSWORD: ${GRAFANA_PASSWORD}
          GF_DASHBOARDS_DEFAULT_HOME_DASHBOARD_PATH: /home/grafana/dashboards/postgres.json
          GF_USERS_ALLOW_SIGN_UP: false
          GF_PATHS_CONFIG: /etc/grafana/grafana.ini
```
> here we can set a few values like the default config path etc

### exporters
[grafana docs](https://grafana.com/oss/prometheus/exporters/):
>  Exporters transform metrics from specific sources into a format that can be ingested by Prometheus
- so in order to scrape metrics from our services, we need to have a additional container deployment that sends the metrics to prometheus
- here is the exporter for postgresql
```yml
  postgresql-exporter:
      image: prometheuscommunity/postgres-exporter
      container_name: postgresql-exporter
      privileged: true
      ports:
          - "9187:9187"
      environment:
          DATA_SOURCE_NAME: "postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?sslmode=disable"
      depends_on:
          prometheus:
              condition: service_started
          postgresql:
              condition: service_healthy
      restart: unless-stopped
      networks:
          - network1
```
## prometheus.yml
```yml
global:
  scrape_interval:     15s
  evaluation_interval: 15s
scrape_configs:
  - job_name: 'envoy'
    metrics_path: /stats/prometheus
    static_configs:
      - targets: ['envoy:19000']
        labels:
          group: 'envoy'
  - job_name: postgresql
    static_configs:
      - targets: ['postgresql-exporter:9187']

  - job_name: redis_exporter
    static_configs:
      - targets: ['redis-exporter:9121']
```

- in the prometheus yml we need to define our targets of our exporters
- we use the ports that we defined in the playbook for the exporters, so for postgres its 9187

# Results
### we configured prometheus
![grafik](https://github.com/user-attachments/assets/8a16dbf8-5d4a-430d-8fdf-0fc9192b9f65)

### we automatically set up prometheus as the datasource
![grafik](https://github.com/user-attachments/assets/49401350-1806-450a-9a8f-4ed7b967b616)

### our admin account is configured accordingly
![grafik](https://github.com/user-attachments/assets/62664b16-07ea-4b3e-b198-95bda0eefdfa)
> we can even set acl and administration but that was a bit much for the example
> however the steps are the same
### we automatically provide our dashboards
![grafik](https://github.com/user-attachments/assets/abc5ad26-9e40-4496-9353-16a919413fd2)

### Postgres Dashboard
![grafik](https://github.com/user-attachments/assets/451bcee1-cc29-4361-8109-1dc69b31ca30)

### envoy dashboards are up and running
![grafik](https://github.com/user-attachments/assets/9b6ead05-b061-4a27-949a-2f06b6b61072)

### redis dashboard is up and running
![grafik](https://github.com/user-attachments/assets/27dbe749-0de6-46fb-835b-1415d7c2239f)



