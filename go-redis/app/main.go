package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/redis/go-redis/v9"
)

var ctx = context.Background()

func main() {
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "redis:6379"
	}

	rdb := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})

	http.HandleFunc("/count", func(w http.ResponseWriter, r *http.Request) {
		count, err := rdb.Incr(ctx, "counter").Result()
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		fmt.Fprintf(w, `{"count": %d}`, count)
	})

	log.Println("Server started on port :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
