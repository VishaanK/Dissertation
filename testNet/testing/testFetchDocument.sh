#!/bin/bash

# Fetch JSON data from the endpoint
response=$(curl -s -X POST "http://localhost:3000/documents/read" -H "Accept: application/json" -d '{"userID": "vk60","documentID":"doc3"}')

# Extract the Base64 data and document name using jq
encodedFile=$(echo "$response" | jq -r '.fileData')
documentName=$(echo "$response" | jq -r '.LedgerData.documentName')

# Validate if both fields are present
if [[ -z "$encodedFile" || -z "$documentName" || "$documentName" == "null" ]]; then
  echo "Error: Missing file data or document name."
  exit 1
fi

# Set the output file name (append .pdf if not already present)
outputFile="${documentName%.pdf}.pdf"s

# Decode the Base64 data into a PDF file
echo "$encodedFile" | base64 -d > "$outputFile"

# Confirm success
if [[ $? -eq 0 ]]; then
  echo "PDF saved successfully as $outputFile!"
else
  echo "Error: Failed to decode and save the PDF."
fi