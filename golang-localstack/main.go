package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/lucaslimafernandes/go-localstack/services"
)

func main() {

	router := gin.Default()
	// gin.SetMode(gin.ReleaseMode)

	router.GET("/", hello)

	// s3 routes
	router.GET("/s3/create-bucket", services.CreateBucket)
	router.GET("/s3/upload", services.FileUpload)
	router.GET("/s3/ls", services.ListBucket)

	// DynamoDB routes
	router.GET("/dynamodb/create-table", services.CreateDynamoTable)
	router.GET("/dynamodb/insert", services.InsertItemDynamo)
	router.GET("/dynamodb/list", services.ListItemsDynamo)

	// Lambda Functions
	router.GET("/lambda/create-function", services.CreateLambda)
	router.GET("/lambda/invoke", services.InvokeLambda)
	router.GET("/lambda/ls", services.ListLambdas)

	router.Run(":8080")
}

func hello(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"ok": "Hello, World!"})
}
