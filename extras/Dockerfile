FROM docker:19.03

ARG UID
ARG GID

RUN apk update && apk add bash bash-completion gawk make netcat-openbsd docker-compose findutils git curl && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/* && \
    addgroup -S -g $GID awesome && adduser -S -G awesome -u $UID awesome && \
    ln -s /opt/bats/bin/bats /usr/local/bin/bats && \
    git clone --depth 1 --branch v1.2.1 https://github.com/bats-core/bats-core.git /opt/bats

COPY bashrc /home/awesome/.bashrc

USER awesome

VOLUME  /code
WORKDIR /code

ENTRYPOINT ["bash"]
