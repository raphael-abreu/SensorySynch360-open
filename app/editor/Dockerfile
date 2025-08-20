FROM httpd:latest
WORKDIR /usr/local/apache2/htdocs/editor
COPY ./editor/httpd-dev.conf /usr/local/apache2/conf/httpd.conf
EXPOSE 80
CMD ["httpd-foreground"]