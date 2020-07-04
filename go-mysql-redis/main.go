package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	log "github.com/sirupsen/logrus"
	"gopkg.in/redis.v5"
)

func main() {
	initialize()

}

func initialize() {
	if err := godotenv.Load(); err != nil {
		fmt.Println("error loading .env file", err)
	}
	err := initializeRedis()
	err1 := initializeDb()
	if err != nil {
		log.Fatal(err)
	}
	if err != nil {
		log.Fatal(err)
	}
	r := mux.NewRouter()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var output string
		if err != nil || err1 != nil {
			output = fmt.Sprintf("error connecting mysql or redis container, check logs")
		} else {
			output = fmt.Sprintf("Connection to mysql and redis successful")
		}
		fmt.Fprintf(w, output)
	})
	http.ListenAndServe(":8080", r)
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		fmt.Println(key)
		fmt.Println("default value using")
		return defaultValue
	}
	return value
}

type sqlDB struct {
	DB *sql.DB
}

func (db *sqlDB) waitToConnect() error {
	var err error
	for i := 0; i < 60; i++ {
		err = db.DB.Ping()
		if err == nil {
			return nil
		}
		time.Sleep(time.Second)
	}
	return err
}

func initializeDb() error {
	var db sqlDB
	var err error
	DbUser := getEnv("MYSQL_USER", "root")
	DbPassword := getEnv("MYSQL_PASSWORD", "vishal1132")
	DbHost := getEnv("MYSQL_URL", "localhost")
	DbPort := getEnv("MYSQL_PORT", "3306")
	DbName := getEnv("MYSQL_DATABASE", "authenticationservices")
	DBURL := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", DbUser, DbPassword, DbHost, DbPort, DbName)
	db.DB, err = sql.Open(getEnv("DB_DRIVER", "mysql"), DBURL)
	if err != nil {
		log.Error("error connecting to mysql database", err)
		return err
	}
	defer db.DB.Close()
	if err = db.waitToConnect(); err != nil {
		return err
	}

	log.Info("connection to mysql successful")
	return nil
}

func initializeRedis() error {
	RedisClient := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_URL"),
		Password: "",
		DB:       0,
	})
	_, err := RedisClient.Ping().Result()
	if err != nil {
		log.Error("Error connecting to redis server", err)
		return err
		// log.Fatal("error", err)
	}
	log.Info("Connection to redis successful")
	return nil
}
