# Create image based on the official Node image from dockerhub
FROM node:lts-buster as build

# Create app directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

# Install dependecies
#RUN npm set progress=false \
#    && npm config set depth 0 \
#    && npm i install
RUN npm ci

# Get all the code needed to run the app
COPY . /usr/src/app

# Expose the port the app runs in
# EXPOSE 3000
# FROM development AS build
RUN npm run build

FROM nginx:1.13-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
#COPY --from=build-env "samples/dotnet-frontend/ngnix.conf" /etc/nginx/nginx.conf
#FROM nginx:1.13-alpine
# COPY --from=builder /usr/src/app/build /usr/share/nginx/html
# COPY nginx/dev.conf /etc/nginx/conf.d/default.conf

