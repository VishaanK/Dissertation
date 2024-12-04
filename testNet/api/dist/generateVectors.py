import torch
from transformers import AutoTokenizer, AutoModel
import PyPDF2
import io
import sys
import json

# Load the Longformer tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("allenai/longformer-base-4096-extra.pos.embd.only")
model = AutoModel.from_pretrained("allenai/longformer-base-4096-extra.pos.embd.only")

def extract_and_embed_pdf(pdf_binary):
    
    if isinstance(pdf_binary, dict):
        pdf_binary = bytes(pdf_binary['data']) 
        
    # Step 1: Extract text from the PDF binary
    file_like_object = io.BytesIO(pdf_binary)
    reader = PyPDF2.PdfReader(file_like_object)
    text = ''.join([page.extract_text() or "" for page in reader.pages])
    
    # Step 2: Generate embeddings
    tokens = tokenizer(text, return_tensors='pt', padding='longest', truncation=False)
    
    # Check if input length exceeds the model's limit
    if tokens['input_ids'].shape[1] > 4096:
        print("Warning: Input length exceeds 4096 tokens. Truncating input, embeddings may be inaccurate.")
        tokens = tokenizer(text, return_tensors='pt', truncation=True, padding='max_length', max_length=4096)
    
    with torch.no_grad():  # Disable gradient calculation for inference
        outputs = model(**tokens)
        
    # Perform mean pooling: average the token embeddings
    token_embeddings = outputs.last_hidden_state  # Shape: [batch_size=1, sequence_length, hidden_size]
    mean_pooled_embedding = torch.mean(token_embeddings, dim=1).squeeze()  # Shape: [hidden_size]
    
    # Convert the tensor to a list (JSON-compatible format)
    embedding_list = mean_pooled_embedding.tolist()
    
    return embedding_list

# Ensure the function is accessible for the bridge and process input/output in JSON
if __name__ == "__main__":
    input_data = json.loads(sys.stdin.read())  # Read the PDF binary from the input

    # Call the function with the input PDF binary
    pdf_binary = bytes(input_data)  # Convert the input data into a binary format
    result = extract_and_embed_pdf(pdf_binary)

    # Output the result as a JSON-encoded list
    print(json.dumps(result))
