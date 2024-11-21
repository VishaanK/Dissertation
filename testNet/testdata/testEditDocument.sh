#!/bin/bash
####This test renames the file and changes its contents i.e the hash 
# Set the endpoint and file path
URL="http://localhost:3000/documents/doc1"
FILE_PATH="Vishaan_Khanna_CV-4.pdf"

echo before edit
curl -X GET "http://localhost:3000/documents/doc1" -H "Accept: application/json"
sleep 2
echo making edit 
# Execute the curl command to send the POST request
curl -X POST $URL \
  -H "Content-Type: multipart/form-data" \
  -F "file=@$FILE_PATH"

# Check if the curl command was successful
if [ $? -eq 0 ]; then
  echo "Request was successfully sent!"
else
  echo "Error: Failed to send the request."
fi

sleep 2
echo after edit
curl -X GET "http://localhost:3000/documents/doc1" -H "Accept: application/json"