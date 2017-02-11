FROM php:7.0
MAINTAINER Filidor Wiese <fili@fili.nl>

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
        curl \
        git \
        dnsutils \
        libssl-dev \
        libcurl4-gnutls-dev \
        libicu-dev \
        wget \
        zip zlib1g-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libmcrypt-dev \
        libpng12-dev \
    && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install -j$(nproc) iconv mcrypt pdo pdo_mysql mysqli curl intl json zip \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install -j$(nproc) gd

# Add non-root user
RUN groupadd -g 1000 docker && useradd docker -u 1000 -g 1000 -m -s /bin/bash && \
    mkdir /home/docker/app && \
    chown -R docker:docker /home/docker

VOLUME /home/docker/app
WORKDIR /home/docker/app
USER docker

CMD [ "php", "-S", "0.0.0.0:9000", "-t", "/home/docker/app/src" ]

EXPOSE 9000
