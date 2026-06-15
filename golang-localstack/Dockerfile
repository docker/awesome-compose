
FROM golang:1.22-alpine AS builder

WORKDIR /app

COPY . .

RUN go build -o main .

FROM alpine:3.19

WORKDIR /app

COPY --from=builder /app/main .

# Copy the file directly in the container
COPY testfile.txt /app/testfile.txt  
COPY lambda_examples/lambda_function_payload.zip /app/lambda_examples/lambda_function_payload.zip  

# EXPOSE 8080

CMD ["./main"]
