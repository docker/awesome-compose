#### Snippet of backend(Node.js)`DockerFile`

You will find this `DockerFile` file in the root directory of the project.

```bash
FROM node:13.13.0-stretch-slim
#Argument that is passed from docker-compose.yaml file
ARG NODE_PORT
#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $NODE_PORT"
# Create app directory
WORKDIR /usr/src/app
# Copy dependency definitions
COPY package.json /usr/src/app
# Install app dependencies
RUN npm install
# Get all the code needed to run the app
COPY . /usr/src/app
#In my case my app binds to port NODE_PORT so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE ${NODE_PORT}
CMD npm run dev
```

##### Explanation of backend(Node.js) `DockerFile`

- The first line tells Docker to use another Node image from the [DockerHub](https://hub.docker.com/). We’re using the official Docker image for Node.js and it’s version 10 image.

- On second line we declare argument `NODE_PORT` which we will pass it from `docker-compose`.

- On third line we log to check argument is successfully read 

- On fourth line we set a working directory ,where the app code will be set to present inside the Docker container.

- On fifth line, we are copying our dependency file (i,e package.json) into container working directory which was set on line four.

- On sixth line, we run npm install for dependencies installation in container.

- On line seven,  we are copying/bundling our code working directory into container working directory which was set on line four.

- On Line eight, we setup the port, that Docker will expose when the container is running. In our case it is the port which we define inside `.env` file, read it from `docker-compose` then passed as a argument to the (backend)`DockerFile`.

- And at last, we tell docker to execute our app inside the container by using node to run `npm run dev. It is the command which I registered in __package.json__ in script section.
###### :clipboard: `Note: For development purpose I used __nodemon__ , If you need to deploy at production you should change CMD from __npm run dev__ to __npm start__.`
