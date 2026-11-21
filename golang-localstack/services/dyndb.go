package services

import (
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/gin-gonic/gin"
)

func CreateDynamoTable(c *gin.Context) {

	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(os.Getenv("S3_REGION")),
		Endpoint:         aws.String(os.Getenv("S3_ENDPOINT")),
		Credentials:      credentials.NewStaticCredentials(os.Getenv("S3_ACCESS_KEY_ID"), os.Getenv("S3_ACCESS_KEY"), ""),
		S3ForcePathStyle: aws.Bool(true), // Enable path-style
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	svc := dynamodb.New(sess)

	tableName := "users"

	input := &dynamodb.CreateTableInput{
		TableName: &tableName,
		KeySchema: []*dynamodb.KeySchemaElement{
			{
				AttributeName: aws.String("ID"),
				KeyType:       aws.String("HASH"),
			},
		},
		AttributeDefinitions: []*dynamodb.AttributeDefinition{
			{
				AttributeName: aws.String("ID"),
				AttributeType: aws.String("S"),
			},
		},
		BillingMode: aws.String("PAY_PER_REQUEST"),
	}

	_, err = svc.CreateTable(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "DynamoDB table created successfully"})

}

func InsertItemDynamo(c *gin.Context) {

	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(os.Getenv("S3_REGION")),
		Endpoint:         aws.String(os.Getenv("S3_ENDPOINT")),
		Credentials:      credentials.NewStaticCredentials(os.Getenv("S3_ACCESS_KEY_ID"), os.Getenv("S3_ACCESS_KEY"), ""),
		S3ForcePathStyle: aws.Bool(true), // Enable path-style
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	svc := dynamodb.New(sess)

	input := &dynamodb.PutItemInput{
		TableName: aws.String("users"),
		Item: map[string]*dynamodb.AttributeValue{
			"ID": {
				S: aws.String("123"),
			},
			"Name": {
				S: aws.String("Lucas"),
			},
		},
	}

	_, err = svc.PutItem(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item inserted successfully!"})

}

func ListItemsDynamo(c *gin.Context) {

	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(os.Getenv("S3_REGION")),
		Endpoint:         aws.String(os.Getenv("S3_ENDPOINT")),
		Credentials:      credentials.NewStaticCredentials(os.Getenv("S3_ACCESS_KEY_ID"), os.Getenv("S3_ACCESS_KEY"), ""),
		S3ForcePathStyle: aws.Bool(true), // Enable path-style
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	svc := dynamodb.New(sess)

	scan := &dynamodb.ScanInput{
		TableName: aws.String("users"),
	}

	result, err := svc.Scan(scan)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"items": result.Items})

}
