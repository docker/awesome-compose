package database

import (
	"code-paste/model"
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func Init(logFile *os.File, host, user, password string, port int) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/code_paste?charset=utf8&parseTime=True&loc=Local", user, password, host, port)
	newLogger := logger.New(
		log.New(logFile, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Silent,
			Colorful:      false,
		},
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		log.Fatal(err)
	}

	DB = db

	db.AutoMigrate(model.Paste{})
}
