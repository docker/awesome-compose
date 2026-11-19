package main

import (
	"fmt"
	"log"
	"net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.URL.RawQuery)
	fmt.Fprintf(w, `
 ▄▄████████  █████▄ ▄█████
▄██████████  █████████████
████████████▄ ▀▀▀▀███▀▀▀▀
██████████████▄▄▄▄███
█████████████████████
█████████████████████
▀███████████████████▀
  ▀▀█████████████▀▀

	
Hello from Docker!

`)
}

func main() {
	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":80", nil))
}
