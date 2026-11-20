# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM rust:1.100-trixie AS buildbase
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
RUN /root/.wasmedge/bin/wasmedge compile target/wasm32-wasip1/release/kafka.wasm kafka.wasm

FROM scratch
ENTRYPOINT [ "kafka.wasm" ]
COPY --link --from=build /kafka.wasm /kafka.wasm
