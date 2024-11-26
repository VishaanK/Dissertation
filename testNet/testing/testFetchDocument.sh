#!/bin/bash
# Set the endpoint
URL="http://localhost:3000/documents/read"

# Execute the curl command to send the GET request
curl -X GET $URL -H "Accept: application/json" -d '{"userID": "vk62","documentID":"doc1"}' 

# Check if the curl command was successful
if [ $? -eq 0 ]; then
  echo "GET request was successfully sent!"
else
  echo "Error: Failed to send the GET request."
fi
