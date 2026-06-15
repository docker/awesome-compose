package services

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/lambda"
	"github.com/gin-gonic/gin"
)

func CreateLambda(c *gin.Context) {

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

	zipFile, err := os.ReadFile("lambda_examples/lambda_function_payload.zip")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "unable to read zip file"})
		return
	}

	svc := lambda.New(sess)

	input := &lambda.CreateFunctionInput{
		Code: &lambda.FunctionCode{
			ZipFile: zipFile,
		},
		FunctionName: aws.String("Example"),
		Handler:      aws.String("lambda_function.lambda_handler"),
		Role:         aws.String("arn:aws:iam::000000000000:role/lambda-role"),
		Runtime:      aws.String("python3.8"),
		Timeout:      aws.Int64(20),
	}

	result, err := svc.CreateFunction(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": result})

}

func ListLambdas(c *gin.Context) {

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

	svc := lambda.New(sess)

	result, err := svc.ListFunctions(&lambda.ListFunctionsInput{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"functions": result.Functions})
}

func InvokeLambda(c *gin.Context) {

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

	svc := lambda.New(sess)

	payload, _ := json.Marshal(map[string]interface{}{
		"key": "value",
	})

	input := &lambda.InvokeInput{
		FunctionName: aws.String("Example"),
		Payload:      payload,
	}

	result, err := svc.Invoke(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": string(result.Payload)})

}
