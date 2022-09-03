package cron

import (
	"code-paste/database"
	"code-paste/model"
	"time"

	"github.com/robfig/cron/v3"
)

func Start() {
	c := cron.New()

	c.AddFunc("@midnight", func() {
		now := time.Now().Format("2006-01-02 15:04:05")
		database.DB.Where("expired_at <= ?", now).Delete(&model.Paste{})
	})
}
