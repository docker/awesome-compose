FROM node:10

RUN mkdir /project
WORKDIR /project

COPY . .

RUN npm install -g @angular/cli
RUN yarn install
CMD ["ng", "serve", "--host", "0.0.0.0"]
