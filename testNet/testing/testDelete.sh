#!/bin/bash

# Set the endpoint and file path
URL="http://localhost:3000/documents/doc1"

curl -X DELETE $URL -H "Accept: application/json"
sleep 5
curl -X GET "http://localhost:3000/healthcheck" -H "Accept: application/json"
