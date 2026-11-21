FROM golang:1.21-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o app


FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/app .

EXPOSE 8080

CMD ["./app"]
