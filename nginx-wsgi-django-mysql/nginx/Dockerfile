FROM nginx:1.21.4-alpine

# Add nginx.conf to container
COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --chown=nginx:nginx default.conf /tmp/default.conf
COPY --chown=nginx:nginx start.sh /app/start.sh

WORKDIR /app

# Add bash for boot cmd &
# permissions and nginx user for tightened security
RUN apk add bash && \
    chown -R nginx:nginx /app && \
    chmod -R 755 /app && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx

CMD ["/app/start.sh"]