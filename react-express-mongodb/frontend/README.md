#### Snippet of frontend(ReactJS)`DockerFile`

You will find this `DockerFile` inside **frontend** directory. 

```bash
# Create image based on the official Node image from dockerhub
FROM node:10
#Argument that is passed from docer-compose.yaml file
ARG FRONT_END_PORT
# Create app directory
WORKDIR /usr/src/app
#Echo the argument to check passed argument loaded here correctly
RUN echo "Argument port is : $FRONT_END_PORT"
# Copy dependency definitions
COPY package.json /usr/src/app
# Install dependecies
RUN npm install
# Get all the code needed to run the app
COPY . /usr/src/app
# Expose the port the app runs in
EXPOSE ${FRONT_END_PORT}
# Serve the app
CMD ["npm", "start"]
```
##### Explanation of frontend(ReactJS) `DockerFile`

Frontend `DockerFile` is almost the same as Backend `DockerFile`.
