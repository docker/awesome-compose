## Compose sample application
### Rails application in dev mode

Project structure:
```
.
├── app
├── docker-compose.yml
├── Dockerfile
├── Gemfile
├── othres dir and files
```

[_docker-compose.yml_](docker-compose.yml)
```
version: '2'
services:
  db:
    image: postgres
    volumes:
      - ./tmp/db:/var/lib/postgresql/data
    ...
  web:
    build: .
    volumes:
      - .:/myapp
    ports:
      - "3000:3000"
    ...
```

## Deploy with docker-compose

```
$ docker-compose up -d
Creating network "ruby_on_rails-postgres_default" with the default driver
Building web
Step 1/14 : FROM ruby:2.6.5
2.6.5: Pulling from library/ruby
...
Creating ruby_on_rails-postgres_db_1_a0b42e5fc001 ... done
Creating ruby_on_rails-postgres_web_1_3da9a09cebff ... done
```

## Expected result

Listing containers must show two containers running and the port mapping as below:
```
$ docker ps
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                    NAMES
dac525a7e7f9        ruby_on_rails-postgres_web   "entrypoint.sh bash …"   49 seconds ago      Up 42 seconds       0.0.0.0:3000->3000/tcp   ruby_on_rails-postgres_web_1_cfc51eb65add
760e6b3dc241        postgres                     "docker-entrypoint.s…"   55 seconds ago      Up 49 seconds       5432/tcp                 ruby_on_rails-postgres_db_1_85be421b80ec
```

After the application starts, navigate to `http://localhost:3000` in your web browser, `it may take about 5 seconds`

## Use docker rails with bash

```
$ docker-compose exec web bash 
root@dac525a7e7f9:/myapp#
```

## Scripts to database

**create database:**
```
rake db:create
```

**migrations database:**
```
rake db:migrate
```

**drop database:**
```
rake db:drop
```

```
root@dac525a7e7f9:/myapp# rake db:create db:migrate
```

## Stop and remove the containers
```
root@dac525a7e7f9:/myapp# exit
exit
$ docker-compose down
Stopping ruby_on_rails-postgres_web_1_43d10612c395 ... done
Stopping ruby_on_rails-postgres_db_1_13519c5de2a7  ... done
Removing ruby_on_rails-postgres_web_1_43d10612c395 ... done
Removing ruby_on_rails-postgres_db_1_13519c5de2a7  ... done
Removing network ruby_on_rails-postgres_default
```
