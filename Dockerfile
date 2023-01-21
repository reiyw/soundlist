FROM lukemathwalker/cargo-chef:latest-rust-1-bullseye AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder 
RUN apt-get update && apt-get install -y --no-install-recommends libopus-dev
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim AS runtime
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    libopus-dev \
    ffmpeg \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

COPY --from=builder /app/target/release/ssspambot /usr/local/bin

ENTRYPOINT ["/usr/local/bin/ssspambot"]
