FROM jdrouet/rust-nightly:buster-slim AS base

ENV USER=root
ENV ROCKET_ADDRESS=0.0.0.0

WORKDIR /code
RUN cargo init
COPY Cargo.toml /code/Cargo.toml
RUN cargo fetch
COPY . /code

FROM base AS development

EXPOSE 8000

CMD [ "cargo", "run", "--offline" ]

FROM base AS builder

RUN cargo build --release --offline

FROM debian:buster-slim

EXPOSE 8000

COPY --from=builder /code/target/release/react-rust-postgres /react-rust-postgres

CMD [ "/react-rust-postgres" ]
