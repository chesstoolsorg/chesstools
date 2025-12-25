#!/bin/bash

# Default mode is not detached
DETACHED=false

# Parse command-line options
while getopts "d" opt; do
  case $opt in
    d) DETACHED=true ;;
    *) echo "Usage: $0 [-d]"; exit 1 ;;
  esac
done

# Update codebase with latest version
echo "Pulling latest code..."
git pull origin main || { echo "Failed to pull latest code"; exit 1; }

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
  echo "Docker is not running. Please start Docker and try again. If it is not installed, find details at https://www.docker.com/"
  exit 1
fi

echo "Installing npm packages..."
npm install

echo "Generating docker image"
docker build -t fen-generator .

echo "Building Next.js app..."
npm run build

echo "Starting Next.js app with PM2 on port 3001..."
pm2 delete chesstools 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 save

echo "App started with PM2. Use 'pm2 logs chesstools' to view logs."
echo "Use 'pm2 status' to check status."
