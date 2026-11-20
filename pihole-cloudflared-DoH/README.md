## Pi-hole with DoH (DNS-Over-HTTPS)
This example provides a base setup for using [Pi-hole](https://docs.pi-hole.net/) with [dnscrypt-proxy](https://github.com/DNSCrypt/dnscrypt-proxy) forwarding DNS queries to Cloudflare over HTTPS.

> ℹ️ **_INFO_**
> This example used `cloudflared` until its DNS proxy mode was [removed in version 2026.2.0](https://developers.cloudflare.com/changelog/2025-11-11-cloudflared-proxy-dns/).
More details on how to customize the installation and the compose file can be found in [Docker Pi-hole documentation](https://github.com/pi-hole/docker-pi-hole).


Project structure:
```
.
├── .env
├── compose.yaml
├── dnscrypt-proxy
│   └── dnscrypt-proxy.toml
└── README.md
```

[_compose.yaml_](compose.yaml)
``` yaml
services:
  pihole:
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "67:67/udp"
      - "8080:80/tcp"
      - "8443:443/tcp"
    ...
  dnscrypt-proxy:
    image: klutchell/dnscrypt-proxy:latest
    ports:
      - "5054:5054/tcp"
      - "5054:5054/udp"
    ...
```

## Configuration

### .env
Before deploying this setup, you need to configure the following values in the [.env](.env) file.
- TZ ([time zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones))
- PIHOLE_PW (admin password)
- PIHOLE_ROUTER_IP (only needed for activated conditional forwarding)
- PIHOLE_NETWORK_DOMAIN (only needed for activated conditional forwarding)
- PIHOLE_REVERSE_DNS (network CIDR, only needed for activated conditional forwarding)

### Conditional forwarding (optional, default: enabled)
If you would like to disable conditional forwarding, delete the `FTLCONF_dns_revServers` environment variable.

### DoH resolver
The upstream DoH resolver is configured in [dnscrypt-proxy/dnscrypt-proxy.toml](dnscrypt-proxy/dnscrypt-proxy.toml).

### Container DNS (optional, default: disabled)
In the docker compose file, dns is added as a comment. To enable dns remove '#' in front of the following lines: 
``` yaml
dns:
    - 127.0.0.1 # "Sets your container's resolve settings to localhost so it can resolve DHCP hostnames [...]" - github.com/pi-hole/docker-pi-hole
    - 1.1.1.1 # Backup server 
```

## Deploy with docker compose
When deploying this setup, the admin web interface will be available on port 8080 (e.g. http://localhost:8080/admin).

``` shell
$ docker compose up -d
Starting dnscrypt-proxy ... done
Starting pihole         ... done
```


## Expected result

Check containers are running and the port mapping:
```
$ docker ps
CONTAINER ID   IMAGE                                 COMMAND                  CREATED         STATUS                            PORTS                                                                                                     NAMES
afcf5ca4214c   pihole/pihole:latest                  "/s6-init"               3 seconds ago   Up 3 seconds (health: starting)   0.0.0.0:53->53/udp, 0.0.0.0:53->53/tcp, 0.0.0.0:67->67/udp, 0.0.0.0:8080->80/tcp, 0.0.0.0:8443->443/tcp   pihole
dfd49ab7a372   klutchell/dnscrypt-proxy:latest       "dnscrypt-proxy -con…"   4 seconds ago   Up 3 seconds                      0.0.0.0:5054->5054/tcp, 0.0.0.0:5054->5054/udp                                                            dnscrypt-proxy
```

Navigate to `http://localhost:8080` in your web browser to access the installed Pi-hole web interface.


Stop the containers with
``` shell
$ docker compose down
# To delete all data run:
$ docker compose down -v
```

## Troubleshooting

### - Starting / Stopping pihole-FTL loop:
  Sometimes, it can happen that there occurs a problem starting pihole-FTL.
  I personally had this issue when adding this line to the shared volumes:
  ```
  - "/pihole/pihole.log:/var/log/pihole.log"
  ```
  To fix this issue, I found this [issue](https://github.com/pi-hole/docker-pi-hole/issues/645#issuecomment-670809672), 
  which suggested adding an empty file (`touch /pihole/pihole.log`) to prevent it from creating a directory.
  The directory would not allow starting pihole-FTL and result in something like this:
  ```
  # Starting pihole-FTL (no-daemon) as root
  # Stopping pihole-FTL
  ...
  ```
  If you created an empty file, you may also check the ownership to prevent permission problems.
  
### - Installing on Ubuntu may conflict with `systemd-resolved` - see [Installing on Ubuntu](https://github.com/pi-hole/docker-pi-hole#installing-on-ubuntu-or-fedora) for help.

### - Environment variables are version-dependent
  Since Pi-hole v6, settings are passed with `FTLCONF_*` environment variables (e.g. `FTLCONF_webserver_api_password`, `FTLCONF_dns_upstreams`),
  the v5 variables (`WEBPASSWORD`, `PIHOLE_DNS_`, `REV_SERVER*`...) are no longer supported.
  Current information about environment variables can be found here: https://github.com/pi-hole/docker-pi-hole