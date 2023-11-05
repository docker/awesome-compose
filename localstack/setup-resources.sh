#!/bin/sh

# Lets check if localstack is available. If we can't reach to localstack
# in 60 seconds we error out
counter=0
until nc -z localstack 4566; do
    if [ ${counter} -eq 60 ]; then
        echo "Timeout: Failed to reach localstack."
        exit 1
    fi
    counter=$((counter + 1))
    printf '.'
    sleep 1
done

aws dynamodb create-table --endpoint-url=http://localstack:4566 --table-name my_table \
    --attribute-definitions AttributeName=key,AttributeType=S \
    --key-schema AttributeName=key,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws kinesis create-stream --endpoint-url=http://localstack:4566 --stream-name my_stream --shard-count 1

aws s3 mb s3://example-bucket --endpoint-url=http://localstack:4566

aws sqs create-queue --endpoint-url=http://localstack:4566 --queue-name my_queue

# you can go on and put initial items in tables...
