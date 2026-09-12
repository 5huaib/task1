FROM php:8.2-fpm

# Install system dependencies, zip extensions, and PostgreSQL drivers
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip nginx libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring

WORKDIR /var/www

COPY . .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install dependencies without running artisan post-install scripts during build
RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs

EXPOSE 8080

CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8080
