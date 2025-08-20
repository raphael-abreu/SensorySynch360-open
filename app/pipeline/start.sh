#!/usr/bin/env bash
rm -rf /app/upload
mkdir /app/upload
chown www-data:www-data /app/upload
chmod 777 /app/upload
service nginx start
uwsgi --ini uwsgi.ini