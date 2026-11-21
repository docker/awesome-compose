#!/bin/sh

awslocal kinesis create-stream --stream-name my_stream --shard-count 1

awslocal s3 mb s3://example-bucket

awslocal sqs create-queue --queue-name my_queue

awslocal dynamodb create-table --table-name my_table \
    --attribute-definitions AttributeName=key,AttributeType=S \
    --key-schema AttributeName=key,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

# you can go on and put initial items in tables...
