#!/bin/bash

# Set the endpoint and file path
URL="http://localhost:3000/documents/verify"
FILE_PATH="Vishaan_Khanna_CV-3.pdf"

# Execute the curl command to send the POST request
curl -X POST $URL \
  -H "Content-Type: multipart/form-data" \
  -F "documentID=doc1" \
  -F "file=@$FILE_PATH"

# Check if the curl command was successful
if [ $? -eq 0 ]; then
  echo "Request was successfully sent!"
else
  echo "Error: Failed to send the request."
fi
