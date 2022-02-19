FROM golang:1.13-alpine AS build
WORKDIR /go/src/github.com/org/repo
COPY . .

RUN go build -o server .

FROM alpine:3.14
EXPOSE 8000
COPY --from=build /go/src/github.com/org/repo/server /server
CMD ["/server"]
