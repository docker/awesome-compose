## Details

An project deploy a React Application with Nginx

### Command

#### Build image and run container

```
$ docker-compose up -d
Building frontend
Sending build context to Docker daemon   1.49MB

Step 1/17 : FROM node:lts AS development
 ---> 9153ee3e2ced
Step 2/17 : WORKDIR /app
 ---> Using cache
 ---> a7909d92148a
Step 3/17 : COPY package.json /app/package.json
 ---> 2e690dfe99b2
Step 4/17 : COPY package-lock.json /app/package-lock.json
 ---> dd0132803f43
 .....
Step 16/17 : COPY --from=build /app/build .
 ---> Using cache
 ---> 447488bdf601
Step 17/17 : ENTRYPOINT ["nginx", "-g", "daemon off;"]
 ---> Using cache
 ---> 6372a67cf86f
Successfully built 6372a67cf86f
Successfully tagged react-nginx_frontend:latest
```

#### Expected result
```
CONTAINER ID   IMAGE                  COMMAND                  CREATED              STATUS              PORTS                               NAMES
b6d00a4974ce   react-nginx_frontend   "nginx -g 'daemon of…"   About a minute ago   Up About a minute   0.0.0.0:80->80/tcp, :::80->80/tcp   frontend
```

After the application start, navigate to http://localhost in your browser:
![page](./output.png)

#### Stop and remove the container

```
$ docker-compose down
Stopping frontend ... done
Removing frontend ... done
Removing network react-nginx_default
```

### Structure

This base project created with [Create React App](https://github.com/facebook/create-react-app).

```
├── docker-compose.yml
├── Dockerfile
├── .dockerignore
├── .gitignore
├── .nginx
│   └── nginx.conf
├── package.json
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── node_modules
├── src
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   ├── index.js
│   ├── logo.svg
│   ├── reportWebVitals.js
│   └── setupTests.js
└── yarn.lock

```
