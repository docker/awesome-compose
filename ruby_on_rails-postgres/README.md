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

## Use docker rails with bash and execute rails server

```
$ docker-compose exec web bash 
root@dac525a7e7f9:/myapp#
```

## How execute rails server

```
root@dac525a7e7f9:/myapp# bundle exec rails s -b 0.0.0.0
=> Booting Puma
=> Rails 6.0.2.2 application starting in development 
=> Run `rails server --help` for more startup options
Puma starting in single mode...
* Version 4.3.3 (ruby 2.6.5-p114), codename: Mysterious Traveller
* Min threads: 5, max threads: 5
* Environment: development
* Listening on tcp://0.0.0.0:3000
Use Ctrl-C to stop
```

After the application starts, navigate to `http://localhost:3000` in your web browser
For stop server `CTRL + C`

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
