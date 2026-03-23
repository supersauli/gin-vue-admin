#!/bin/bash

echo "Stopping services..."
docker stop gva-pgsql gva-redis 2>/dev/null || true
docker rm gva-pgsql gva-redis 2>/dev/null || true
docker volume rm pgsql-data redis-data 2>/dev/null || true

echo "Services stopped and cleaned up!"