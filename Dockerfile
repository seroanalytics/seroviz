FROM nginx:1.17

# Only used for generating self-signed certificates
RUN apt-get update && apt-get install -y openssl

# Clear out existing configuration
RUN rm /etc/nginx/conf.d/default.conf

VOLUME /var/log/nginx
VOLUME /run/proxy

COPY build /usr/share/nginx/html
COPY proxy/nginx.conf /etc/nginx/nginx.conf.template
COPY proxy/bin /usr/local/bin
COPY proxy/ssl /usr/local/share/ssl

ENTRYPOINT ["/usr/local/bin/seroviz-proxy"]
