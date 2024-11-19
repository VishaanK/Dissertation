#!/bin/bash

# Set the endpoint and file path
URL="http://localhost:3000/documents"
FILE_PATH="Vishaan_Khanna_CV-4.pdf"

# Set the request body parameters
CREATOR_ID="vk60"
DOCUMENT_NAME="Vishaan_Khanna_CV-4"
DOCUMENT_TYPE="pdf"
SIGNABLE="false"

# Execute the curl command to send the POST request
curl -X POST $URL \
  -H "Content-Type: multipart/form-data" \
  -F "creatorID=$CREATOR_ID" \
  -F "documentName=$DOCUMENT_NAME" \
  -F "documentType=$DOCUMENT_TYPE" \
  -F "signable=$SIGNABLE" \
  -F "file=@$FILE_PATH"

# Check if the curl command was successful
if [ $? -eq 0 ]; then
  echo "Request was successfully sent!"
else
  echo "Error: Failed to send the request."
fi
