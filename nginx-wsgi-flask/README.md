# Compose Sample Application

## NGINX Reverse Proxy -> WSGI -> Python/Flask Backend

Project structure:

```text
.
├── compose.yaml
├── flask
│   ├── app.py
│   ├── Dockerfile
│   ├── requirements.txt
└── nginx
    ├── default.conf
    ├── Dockerfile
    ├── nginx.conf
```

[_compose.yaml_](compose.yaml)

```yml
services:
  nginx-proxy:
    build: nginx
    ports:
    - 80:80
  flask-app:
    build: flask
    ...
```

The compose file defines an application with two services `nginx-proxy` and `flask-app`.
When deploying the application, docker compose maps port 80 of the web service container to port 80 of the host as specified in the file.

Make sure port 80 on the host is not being used by another container, otherwise the port should be changed.

## Deploy with docker compose

```bash
$ docker compose up -d
Creating network "nginx-wsgi-flask_default" with the default driver
Building flask-app
...
Building nginx-proxy
...
Creating nginx-wsgi-flask_flask-app_1 ... done
Creating nginx-wsgi-flask_nginx-proxy_1 ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:

```bash
$ docker ps
CONTAINER ID   IMAGE            COMMAND                  CREATED              STATUS                          PORTS                   NAMES
bde3f29cf571   ...nginx-proxy   "/docker-entrypoint.…"   About a minute ago   Up 4 seconds (health: starting) 0.0.0.0:80->80/tcp      ...nginx-proxy_1
86c44470b547   ...flask-app     "gunicorn -w 3 -t 60…"   About a minute ago   Up 5 seconds (health: starting) 0.0.0.0:53323->8000/tcp ...flask-app_1
```

After the application starts, run the command in a terminal:

```bash
$ curl localhost
Hello World!
```

Stop and remove the containers

```bash
$ docker compose down
Stopping nginx-wsgi-flask_nginx-proxy_1 ... done
Stopping nginx-wsgi-flask_flask-app_1   ... done
Removing nginx-wsgi-flask_nginx-proxy_1 ... done
Removing nginx-wsgi-flask_flask-app_1   ... done
Removing network nginx-wsgi-flask_default
```

Deploy and scale the application. Create three different instances.

```bash
$ docker compose up -d --scale flask-app=3
✔ Network nginx-wsgi-flask_default          Created 0.0s
✔ Container nginx-wsgi-flask-flask-app-1    Started 0.4s
✔ Container nginx-wsgi-flask-flask-app-3    Started 0.9s
✔ Container nginx-wsgi-flask-flask-app-2    Started 0.6s
✔ Container nginx-wsgi-flask-nginx-proxy-1  Started 1.1s
```

See the three different instances.

```bash
$ docker ps
CONTAINER ID   IMAGE                          COMMAND                  CREATED         STATUS                            PORTS                     NAMES
604ad97b224b   nginx-wsgi-flask-nginx-proxy   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds (health: starting)   0.0.0.0:80->80/tcp        nginx-wsgi-flask-nginx-proxy-1
317e4d706858   nginx-wsgi-flask-flask-app     "gunicorn -w 3 -t 60…"   5 seconds ago   Up 5 seconds (health: starting)   0.0.0.0:53323->8000/tcp   nginx-wsgi-flask-flask-app-1
39905ed2b5a0   nginx-wsgi-flask-flask-app     "gunicorn -w 3 -t 60…"   5 seconds ago   Up 4 seconds (health: starting)   0.0.0.0:53324->8000/tcp   nginx-wsgi-flask-flask-app-2
f98baa201cb6   nginx-wsgi-flask-flask-app     "gunicorn -w 3 -t 60…"   5 seconds ago   Up 4 seconds (health: starting)   0.0.0.0:53325->8000/tcp   nginx-wsgi-flask-flask-app-3
```

Each time the url is called, nginx fowards the message to one of three instances. See container id value in the result string.

``` bash
$ curl localhost/info
{"connecting_ip":"172.30.0.1","containe_id":"f98baa201cb6","host":"localhost","proxy_ip":"172.30.0.1","user-agent":"curl/7.79.1"}
```

## About

By following the steps above, you will have an NGINX Reverse Proxy and a Flask backend. The general traffic flow will look like the following:

`Client -> NGINX -> WSGI -> Flask`

### NGINX

With this deployment model, we use NGINX to proxy and handle all requests to our Flask backend. This is a powerful deployment model as we can use NGINX to cache responses or even act as an application load balancer between multiple Flask backends. You could also integrate a Web Application Firewall into NGINX to protect your Flask backend from attacks.

### WSGI

WSGI (Web Server Gateway Interface) is the interface that sits in between our NGINX proxy and Flask backend. It is used to handle requests and interface with our backend. WSGI allows you to handle thousands of requests at a time and is highly scalable. In this `docker-compose` sample, we use Gunicorn for our WSGI.

### Flask

Flask is a web development framework written in Python. It is the "backend" which processes requests.

A couple of sample endpoints are provided in this `docker-compose` example:

* `/` - Returns a "Hello World!" string.
* `/cache-me` - Returns a string which is cached by the NGINX reverse proxy. This demonstrates an intermediary cache implementation.
* `/info` - Returns informational headers about the request. Some are passed from NGINX for added client visibility.
