# LocalStack

This example shows how to use [LocalStack](https://localstack.cloud/) to emulate AWS services locally using docker compose.

Project structure:

```text
.
├── init.d/
│   └── init.sh
├── compose.yaml
└── README.md
```

[_compose.yaml_](compose.yaml)

```yml
services:
  localstack:
    image: localstack/localstack:2.3.2
    ports:
      - "4566:4566" # LocalStack Gateway
      - "4510-4559:4510-4559" # external services port range
    ...
```

## Deploy with docker compose

```sh
docker compose up -d
```

It will execute the scripts located in the `init.d/` folder to bootstrap the resources.

## Resources

Once the docker compose is up, it will create the following resources:

- [DynamoDB Table](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [Kinesis Stream](https://docs.aws.amazon.com/streams/latest/dev/getting-started.html)
- [S3 Bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [SQS Queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)

## LocalStack Desktop

You can use [LocalStack Desktop](https://docs.localstack.cloud/user-guide/tools/localstack-desktop/) to manage the resources created by the docker compose.

## Testing the services

From outside the container you can execute the following commands to test the service each service:

- **DynamoDB**

```sh
$ awslocal dynamodb list-tables
{
    "TableNames": [
        "my_table"
    ]
}
```

- **Kinesis**

```sh
$ awslocal kinesis list-streams
{
    "StreamNames": [
        "my_stream"
    ]
}
```

- **S3**

```sh
$ awslocal s3 ls
2022-08-08 03:16:01 example-bucket
```

- **SQS**

```sh
$ awslocal sqs list-queues
{
    "QueueUrls": [
        "http://localhost:4566/000000000000/my_queue"
    ]
}
```
