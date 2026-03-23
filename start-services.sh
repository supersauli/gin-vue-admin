#!/bin/bash

echo "Starting PostgreSQL..."
docker run -d \
  --name gva-pgsql \
  -e POSTGRES_PASSWORD="Aa@6447985" \
  -e POSTGRES_DB="qmPlus" \
  -e POSTGRES_USER="gva" \
  -e TZ="Asia/Shanghai" \
  -p 15432:5432 \
  -v pgsql-data:/var/lib/postgresql/data \
  --restart always \
  postgres:13

echo "Waiting for PostgreSQL to start..."
sleep 10

echo "Starting Redis..."
docker run -d \
  --name gva-redis \
  -e REDIS_ARGS="--appendonly yes" \
  -p 16379:6379 \
  -v redis-data:/data \
  --restart always \
  redis:6-alpine

echo "Services started successfully!"
echo "PostgreSQL: localhost:15432"
echo "Redis: localhost:16379"