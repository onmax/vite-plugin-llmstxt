#!/bin/bash
# Deployment script

echo "Building application..."
npm run build

echo "Deploying to production..."
npm run deploy

echo "Deployment complete!"
