package model

import "time"

type Paste struct {
	ID          string    `json:"id" gorm:"primaryKey"`
	ExpiredAt   time.Time `json:"expired_at"`
	ExpiredDays int       `json:"expired_days"`
	Type        string    `json:"type"`
	Data        string    `json:"data"`
}
