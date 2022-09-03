FROM golang:latest
ENV GO111MODULE=on
WORKDIR /server
COPY . .
RUN go env -w GOPROXY=https://goproxy.cn
RUN go build
EXPOSE 8080
CMD ["./code-paste"]