#!/bin/bash

# Set the endpoint and file path
URL="http://localhost:3000/documents"


# Send DELETE request with a body (userID parameter)
curl -X DELETE $URL -d '{"userID": "vk62", "documentID":"doc1"}' -H "Content-Type: application/json" -H "Accept: application/json"
# Wait for 2 seconds
sleep 2

# Send GET request to healthcheck endpoint
curl -X GET "http://localhost:3000/healthcheck" -H "Accept: application/json"
