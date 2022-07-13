server {
    listen       80;
    server_name  localhost;
    location / {
        proxy_pass          http://backend:8000;
        proxy_http_version  1.1;
    }
}
