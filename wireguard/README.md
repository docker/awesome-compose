## Wireguard
This example provides a base setup for using [Wireguard](https://www.wireguard.com/).
More details on how to customize the installation and the compose file can be found in [linuxserver documentation](https://hub.docker.com/r/linuxserver/wireguard).

Project structure:
```
.
├── .env
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)
``` yaml
services:
  wireguard:
    image: linuxserver/wireguard
```

## Configuration

### .env
Before deploying this setup, you need to configure the following values in the [.env](.env) file.
- TIMEZONE
- VPN_SERVER_URL (recommended setting up a server url with e.g. http://www.duckdns.org/ if you don't own a domain)

## Deploy with docker compose
When deploying this setup, the log will show relevant information. You need to forward the external port 51820 to access your VPN from outside. 

``` shell
$ docker compose up
Starting wireguard ...
wireguard    | **** It seems the wireguard module is already active. Skipping kernel header install and module compilation. ****
wireguard    | **** Server mode is selected ****
wireguard    | **** External server address is set to your-domain.dyndns.com # free examples http://www.duckdns.org/ and https://www.noip.com/ ****
wireguard    | **** External server port is set to 51820. Make sure that port is properly forwarded to port 51820 inside this container ****
[...]
wireguard    | PEER 1 QR code:
wireguard    | [GENERATED QR CODE TO SCAN FOR YOUR CONNECTION DETAILS]

```

## Expected result

Check containers are running:
```
$ docker ps
CONTAINER ID   IMAGE                           COMMAND                  CREATED          STATUS                          PORTS                                                                                  NAMES
4992922d23dc   linuxserver/wireguard           "/init"                  7 seconds ago    Up 5 seconds                    0.0.0.0:51820->51820/udp, :::51820->51820/udp                                          wireguard
```

## Mobile Wireguard App

### Android
<a href="https://play.google.com/store/apps/details?id=com.wireguard.android"><img src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" height="75"></a>

Install your Wireguard client on an Apple device by downloading the wireguard app and scanning the QR Code.

### iOS
<a href="https://apps.apple.com/de/app/wireguard/id1441195209"><img src="https://www.apple.com/de/itunes/link/images/link_badge_appstore_large_2x.png" height="55"></a>

Install your Wireguard client on an Apple device by downloading the wireguard app and scanning the QR Code.

Stop the containers with
``` shell
$ docker compose down
# To delete all data run:
$ docker compose down -v
```

## Troubleshooting

### - (Raspberry Pi) Kernel Headers
  On Raspberry Pi run `sudo apt update && sudo apt upgrade && sudo apt install raspberrypi-kernel-headers` and reboot before starting Wireguard.
  Other Ubuntu / Debian based systems may need to install the kernel-headers too. Run `sudo apt update && sudo apt upgrade && sudo apt install linux-headers-$(uname -r)`
  
### - Server Mode Options
  To create new clients or display existing ones, take a look at the "[Server Mode](https://hub.docker.com/r/linuxserver/wireguard)" section