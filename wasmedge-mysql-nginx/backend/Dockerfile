# syntax=docker/dockerfile:1

FROM --platform=$BUILDPLATFORM rust:1.100-trixie AS buildbase
WORKDIR /src
RUN <<EOT bash
    set -ex
    apt-get update
    apt-get install -y \
        git \
        clang
    rustup target add wasm32-wasip1
EOT
# This line installs WasmEdge including the AOT compiler
RUN curl -sSf https://raw.githubusercontent.com/WasmEdge/WasmEdge/master/utils/install.sh | bash

FROM buildbase AS build
COPY Cargo.toml .
COPY src ./src 
# Build the Wasm binary
RUN --mount=type=cache,target=/usr/local/cargo/git/db \
    --mount=type=cache,target=/usr/local/cargo/registry/cache \
    --mount=type=cache,target=/usr/local/cargo/registry/index \
    cargo build --target wasm32-wasip1 --release
# This line builds the AOT Wasm binary
RUN /root/.wasmedge/bin/wasmedge compile target/wasm32-wasip1/release/order_demo_service.wasm order_demo_service.wasm

FROM scratch
ENTRYPOINT [ "order_demo_service.wasm" ]
COPY --link --from=build /src/order_demo_service.wasm /order_demo_service.wasm
