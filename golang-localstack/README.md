# Compose Sample Application

## Golang Application with AWS Simulation using LocalStack

This project simulates AWS services such as S3, DynamoDB, and Lambda using LocalStack, and provides a Golang API for interaction with these services.

### Project Structure:

```plaintext
.
├── docker-compose.yaml               # Docker Compose file to start LocalStack and the Golang app
├── Dockerfile                        # Dockerfile for building the Golang app container
├── go.mod                            # Go module definitions
├── go.sum                            # Go module dependencies
├── lambda_examples                   # Directory containing Lambda examples
│   ├── lambda_function_payload.zip   # Zipped Python Lambda function
│   └── lambda_function.py            # Python Lambda function source code
├── main.go                           # Main entry point for the Go API
├── README.md                         # Project README file
├── services                          # Go services for interacting with AWS services
│   ├── dyndb.go                      # DynamoDB service implementation
│   ├── file_upload.go                # S3 file upload service
│   └── lambda_handler.go             # Lambda invocation service
└── testfile.txt                      # Test file for upload

2 directories, 12 files
```

### _compose.yaml_

This is a sample `docker-compose` file for running LocalStack and the Golang application.

```yaml
services:

  localstack:
    image: localstack/localstack:latest
    environment:
      - SERVICES=lambda,s3,dynamodb
      - DEBUG=1
    ports:
      - "4566:4566"        # LocalStack service endpoint
      - "4571:4571"        # Optional additional port
    volumes:
      - ./localstack:/docker-entrypoint-initaws.d
      - /var/run/docker.sock:/var/run/docker.sock  # Docker socket for Lambda runtime execution
    container_name: localstack

  app:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - localstack
    environment:
      - S3_REGION=us-east-1
      - S3_ENDPOINT=http://localstack:4566
      - S3_ACCESS_KEY_ID=test
      - S3_ACCESS_KEY=test
      - S3_BUCKET=test-bucket
    ports:
      - "8080:8080"        # Exposing API service on port 8080
    container_name: golang_app
```

### Running the Application with Docker Compose

You can deploy the application using Docker Compose, which will start both the LocalStack (simulating AWS services) and the Golang application.

#### Steps:

1. **Build and start the containers**:

   ```bash
   docker compose up -d --build
   ```

   This command will create the network, build the images, and start the services for LocalStack and the Golang app.

   Example output:

   ```bash
   [+] Building 1.0s (16/16) FINISHED                               
   ...
   [+] Running 2/2
   ✔ Container localstack  Running                                           0.0s 
   ✔ Container golang_app  Started                                           0.3s 
   ```

2. **Verify the containers are running**:

   ```bash
   docker ps
   ```

   Example output:

   ```bash
    CONTAINER ID   IMAGE                          COMMAND                  CREATED      STATUS                   PORTS                                                                                                           NAMES
    e97c72533b0e   go-localstack-app              "./main"                 3 days ago   Up About a minute        0.0.0.0:8080->8080/tcp, :::8080->8080/tcp                                                                       golang_app
    eef6573ca52c   localstack/localstack:latest   "docker-entrypoint.sh"   3 days ago   Up 4 minutes (healthy)   0.0.0.0:4566->4566/tcp, :::4566->4566/tcp, 4510-4559/tcp, 5678/tcp, 0.0.0.0:4571->4571/tcp, :::4571->4571/tcp   localstack
   ```

3. **Access the application**:

   After the application starts, navigate to `http://localhost:8080` to interact with the Golang API.

4. **API Routes**:

   The Golang application exposes several routes for interacting with LocalStack services:

   - **General Route**:
     - `GET /`: Simple "Hello, World!" response.

   - **S3 Routes**:
     - `GET /s3/create-bucket`: Creates an S3 bucket in LocalStack.
     - `GET /s3/upload`: Uploads the file `testfile.txt` to the S3 bucket.
     - `GET /s3/ls`: Lists the contents of the S3 bucket.

   - **DynamoDB Routes**:
     - `GET /dynamodb/create-table`: Creates a DynamoDB table in LocalStack.
     - `GET /dynamodb/insert`: Inserts a record into the DynamoDB table.
     - `GET /dynamodb/list`: Lists the records in the DynamoDB table.

   - **Lambda Routes**:
     - `GET /lambda/create-function`: Creates a Lambda function from the `lambda_function_payload.zip` file.
     - `GET /lambda/invoke`: Invokes the Lambda function.
     - `GET /lambda/ls`: Lists the available Lambda functions.

### Expected Results

1. **General Route**
   When you access the general route, it should return a simple response:
   ```json
   {
     "ok": "Hello, World!"
   }
   ```

2. **S3 Routes**
   The `testfile.txt` should be uploaded to the S3 bucket, and you can verify its presence by listing the contents of the bucket.

   - Creating the bucket:

   ```json
   {
    "data": "OK"
   }
   ```
   
   - Uploading the example file:

   ```json
   {
    "data": "OK"
   }
   ``` 

   - Listing all existing files:

   ```json
    {
        "response": [
            {
                "Key": "testfile.txt",
                "LastModified": "2024-10-15T00:11:40Z",
                "Size": 314,
                "StorageClass": "STANDARD"
            }
        ]
    }
   ``` 

3. **DynamoDB Operations**
   You can create a DynamoDB table, insert records, and list them using the provided routes.

   - Creating the DynamoDB table:
  
   ```json
   {
    "message": "DynamoDB table created successfully"
   }
   ```

   - Inserting data:

   ```json
   {
    "message": "Item inserted successfully!"
   }
   ```

   - Listing the records:

   ```json
   {
     "items": [
         {
             "ID": {
                 "S": "123"
             },
             "Name": {
                 "S": "Lucas"
             }
         }
     ]
   }
   ```

4. **Lambda Invocation**:
   When a Lambda function is invoked, it should return a `200` status code with a response like:

   - Creating a Lambda function:

   ```json
    {
      "response": {
        "FunctionName": "Example",
        "Handler": "lambda_function.lambda_handler",
        "Runtime": "python3.8",
        "State": "Pending"
      }
    }
   ```

   - Listing functions:

   ```json
    {
      "functions": [
        {
          "FunctionName": "Example",
          "Handler": "lambda_function.lambda_handler",
          "Runtime": "python3.8"
        }
      ]
    }
   ```

   - Invoking the function:
    
    ```json
     {
      "statusCode": 200,
      "body": "ok"
     }
    ```

### Stopping and Removing the Containers

To stop and remove the containers, run:

```bash
docker compose down
```

This command will stop all running containers and remove them along with the associated network.

---

### Additional Information

- This project simulates AWS services using **LocalStack**. You can interact with S3, DynamoDB, and Lambda by sending HTTP requests to the Golang application, which acts as an API wrapper for these AWS services.
- Ensure that Docker is correctly installed and that the `/var/run/docker.sock` is mounted to allow Lambda functions to run within the LocalStack environment.

