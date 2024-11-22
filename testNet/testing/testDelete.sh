#!/bin/bash

# Set the endpoint and file path
URL="http://localhost:3000/documents/doc1"

curl -X DELETE $URL 
sleep 2
curl -X GET "http://localhost:3000/healthcheck" -H "Accept: application/json"
