# Quickstart: Compose and WordPress

You can use Docker Compose to easily run WordPress in an isolated environment
built with Docker containers. This quick-start guide demonstrates how to use
Compose to set up and run WordPress. Before starting, make sure you have
[Compose installed](https://docs.docker.com/compose/install/).

## Define the project

1.  Create an empty project directory.

    You can name the directory something easy for you to remember.
    This directory is the context for your application image. The
    directory should only contain resources to build that image.

    This project directory contains a `docker-compose.yml` file which
    is complete in itself for a good starter wordpress project.

    >**Tip**: You can use either a `.yml` or `.yaml` extension for
    this file. They both work.

2.  Change into your project directory.

    For example, if you named your directory `my_wordpress`:

    ```console
    $ cd my_wordpress/
    ```

3.  Create a `docker-compose.yml` file that starts your
    `WordPress` blog and a separate `MySQL` instance with volume
    mounts for data persistence:

    ```yaml
    services:
      db:
        # We use a mariadb image which supports both amd64 & arm64 architecture
        image: mariadb:10.6.4-focal
        # If you really want to use MySQL, uncomment the following line
        #image: mysql:8.0.27
        command: '--default-authentication-plugin=mysql_native_password'
        volumes:
          - db_data:/var/lib/mysql
        restart: always
        environment:
          - MYSQL_ROOT_PASSWORD=somewordpress
          - MYSQL_DATABASE=wordpress
          - MYSQL_USER=wordpress
          - MYSQL_PASSWORD=wordpress
        expose:
          - 3306
          - 33060
      wordpress:
        image: wordpress:latest
        volumes:
          - wp_data:/var/www/html
        ports:
          - 80:80
        restart: always
        environment:
          - WORDPRESS_DB_HOST=db
          - WORDPRESS_DB_USER=wordpress
          - WORDPRESS_DB_PASSWORD=wordpress
          - WORDPRESS_DB_NAME=wordpress
    volumes:
      db_data:
      wp_data:
    ```

   > **Notes**:
   >
   * The docker volumes `db_data` and `wordpress_data` persists updates made by WordPress
   to the database, as well as the installed themes and plugins. [Learn more about docker volumes](https://docs.docker.com/storage/volumes/)
   >
   * WordPress Multisite works only on ports `80` and `443`.
   {: .note-vanilla}

### Build the project

Now, run `docker compose up -d` from your project directory.

This runs [`docker compose up`](https://docs.docker.com/engine/reference/commandline/compose_up/) in detached mode, pulls
the needed Docker images, and starts the wordpress and database containers, as shown in
the example below.

```console
$ docker compose up -d

Creating network "my_wordpress_default" with the default driver
Pulling db (mysql:5.7)...
5.7: Pulling from library/mysql
efd26ecc9548: Pull complete
a3ed95caeb02: Pull complete
<...>
Digest: sha256:34a0aca88e85f2efa5edff1cea77cf5d3147ad93545dbec99cfe705b03c520de
Status: Downloaded newer image for mysql:5.7
Pulling wordpress (wordpress:latest)...
latest: Pulling from library/wordpress
efd26ecc9548: Already exists
a3ed95caeb02: Pull complete
589a9d9a7c64: Pull complete
<...>
Digest: sha256:ed28506ae44d5def89075fd5c01456610cd6c64006addfe5210b8c675881aff6
Status: Downloaded newer image for wordpress:latest
Creating my_wordpress_db_1
Creating my_wordpress_wordpress_1
```

> **Note**: WordPress Multisite works only on ports `80` and/or `443`.
If you get an error message about binding `0.0.0.0` to port `80` or `443`
(depending on which one you specified), it is likely that the port you
configured for WordPress is already in use by another service.

### Bring up WordPress in a web browser

At this point, WordPress should be running on port `80` of your Docker Host,
and you can complete the "famous five-minute installation" as a WordPress
administrator.

> **Note**: The WordPress site is not immediately available on port `80`
because the containers are still being initialized and may take a couple of
minutes before the first load.

If you are using Docker Desktop for Mac or Docker Desktop for Windows, you can use
`http://localhost` as the IP address, and open `http://localhost:80` in a web
browser.

![Choose language for WordPress install](images/wordpress-lang.png)

![WordPress Welcome](images/wordpress-welcome.png)

### Shutdown and cleanup

The command [`docker compose down`](https://docs.docker.com/engine/reference/commandline/compose_down/) removes the
containers and default network, but preserves your WordPress database.

The command `docker compose down --volumes` removes the containers, default
network, and the WordPress database.

## More Compose documentation

* [Docker Compose overview](https://docs.docker.com/compose/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)
* [Getting Started with Docker Compose](https://docs.docker.com/compose/gettingstarted/)
* [Docker Compose Command line reference](https://docs.docker.com/compose/reference/)
* [Compose file reference](https://docs.docker.com/compose/compose-file/)
* [Awesome Compose WordPress sample](../../wordpress-mysql/README.md)
