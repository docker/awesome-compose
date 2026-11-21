########################################################################
### Composer

FROM composer:lts AS composer

# Copy the contents to app directory
COPY . /app/

RUN composer install        \
    --ignore-platform-reqs  \
    --no-ansi               \
    --no-interaction        \
    --no-scripts

RUN composer dump-autoload --optimize --classmap-authoritative

### Composer
########################################################################
### PHP

FROM php:8.2-apache AS final

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring zip

# Enable Apache rewrite module
RUN a2enmod rewrite

WORKDIR /var/www/html

COPY --from=composer /app .

COPY .env.example .env

RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

# Start Apache
CMD ["apachectl", "-D", "FOREGROUND"]

COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

### PHP
########################################################################