FROM node:lts AS development

WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

# add app
COPY . ./

# start app
CMD ["npm", "start"]

ENV CI=true
ENV PORT=3000

FROM development AS build
RUN npm run build

FROM nginx:1.13-alpine
COPY --from=build /code/build /usr/share/nginx/html
