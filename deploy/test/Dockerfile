FROM nginx:alpine
COPY dist /usr/share/nginx/html
COPY deploy/test/nginx.conf /etc/nginx/conf.d/default.conf

COPY deploy/test/server.crt /etc/nginx/ssl/server.crt
COPY deploy/test/server.key /etc/nginx/ssl/server.key

# Fix permissions so nginx worker (non-root) can read all files and directories
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 443