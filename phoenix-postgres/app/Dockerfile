
# ---- Build Stage ----
FROM elixir:1.9-alpine AS app_builder

# Set environment variables for building the application
ENV MIX_ENV=prod
ENV LANG=C.UTF-8

# install build dependencies
RUN apk add --update git build-base nodejs npm yarn python

# Install hex and rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Create the application build directory
WORKDIR /app

# install mix dependencies
COPY mix.* ./
COPY config config
RUN mix deps.get \
    && mix release.init \
    && mix deps.compile --force --only $MIX_ENV 

# build assets
COPY assets assets
COPY priv priv
RUN cd assets \
    && npm install \
    && npm run deploy
RUN mix phx.digest

# build project and release
COPY lib lib
RUN mix compile \ 
    && mix release

# ---- Application Stage ----
FROM alpine as app

ENV MIX_ENV=prod
ENV LANG=C.UTF-8

# Install openssl
RUN apk add --update openssl ncurses-libs

# create a non root user
RUN addgroup -S appgroup && adduser -S app_user -G appgroup

WORKDIR /home/app_user

# Copy over the build artifact from the previous step 
COPY --from=app_builder /app/_build/${MIX_ENV}/rel .

COPY entrypoint.sh .

RUN chmod 755 entrypoint.sh

RUN chown -R app_user: .

USER app_user

CMD ["sh", "entrypoint.sh"]
