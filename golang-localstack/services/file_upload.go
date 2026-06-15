package services

import (
	"bytes"
	"io"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
)

func FileUpload(c *gin.Context) {

	var uploadBody io.ReadSeeker

	src, err := os.Open("testfile.txt")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to read the file"})
		return
	}
	defer src.Close()

	filename := aws.String("testfile.txt")

	fileContent, err := io.ReadAll(src)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// fmt.Println(string(fileContent))

	uploadBody = bytes.NewReader(fileContent)

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

	// Cria um novo cliente do S3
	svc := s3.New(sess)

	uploadParams := &s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("S3_BUCKET")),
		Key:    filename,
		Body:   uploadBody,
	}

	_, err = svc.PutObject(uploadParams)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "OK"})

}

func CreateBucket(c *gin.Context) {

	sess, err := session.NewSession(&aws.Config{
		Region:           aws.String(os.Getenv("S3_REGION")),
		Endpoint:         aws.String(os.Getenv("S3_ENDPOINT")),
		Credentials:      credentials.NewStaticCredentials(os.Getenv("S3_ACCESS_KEY_ID"), os.Getenv("S3_ACCESS_KEY"), ""),
		S3ForcePathStyle: aws.Bool(true), // Enable path-style
	})
	if err != nil {
		c.JSON((http.StatusInternalServerError), gin.H{"error": err.Error()})
		return
	}

	svc := s3.New(sess)

	bucketName := "test-bucket"

	createBucketInput := &s3.CreateBucketInput{
		Bucket: &bucketName,
	}

	_, err = svc.CreateBucket(createBucketInput)
	if err != nil {
		c.JSON((http.StatusInternalServerError), gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "OK"})

}

func ListBucket(c *gin.Context) {

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

	svc := s3.New(sess)

	res, err := svc.ListObjects(&s3.ListObjectsInput{Bucket: aws.String("test-bucket")})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"response": res.Contents})

}
