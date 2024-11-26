#!/bin/bash
####This test renames the file and changes its contents i.e the hash 
# Set the endpoint and file path
URL="http://localhost:3000/documents/doc2"
FILE_PATH="Vishaan_Khanna_CV-3.pdf"

echo making edit 
# Execute the curl command to send the POST request
curl -X POST $URL \
  -H "Content-Type: multipart/form-data" \
  -F "userID=vk62" \
  -F "file=@$FILE_PATH"

# Check if the curl command was successful
if [ $? -eq 0 ]; then
  echo "Request was successfully sent!"
else
  echo "Error: Failed to send the request."
fi

sleep 3
echo after edit

# Fetch JSON data from the endpoint
response=$(curl -s -X POST "http://localhost:3000/documents/read" -H "Accept: application/json" -d '{"userID": "vk62","documentID":"doc1"}')

# Extract the Base64 data and document name using jq
encodedFile=$(echo "$response" | jq -r '.fileData')
documentName=$(echo "$response" | jq -r '.LedgerData.documentName')

# Validate if both fields are present
if [[ -z "$encodedFile" || -z "$documentName" || "$documentName" == "null" ]]; then
  echo "Error: Missing file data or document name."
  exit 1
fi

# Set the output file name (append .pdf if not already present)
outputFile="${documentName%.pdf}.pdf"

# Decode the Base64 data into a PDF file
echo "$encodedFile" | base64 -d > "$outputFile"

# Confirm success
if [[ $? -eq 0 ]]; then
  echo "PDF saved successfully as $outputFile!"
else
  echo "Error: Failed to decode and save the PDF."
fi