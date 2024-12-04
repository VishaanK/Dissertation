import torch
from transformers import AutoTokenizer, AutoModel
import PyPDF2

# Step 1: Load the PDF and extract text
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''.join([page.extract_text() or "" for page in reader.pages])
    return text

# Step 2: Load the Longformer tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("allenai/longformer-base-4096-extra.pos.embd.only")
model = AutoModel.from_pretrained("allenai/longformer-base-4096-extra.pos.embd.only")

def get_embeddings(text):
    # Tokenize without truncation
    tokens = tokenizer(text, return_tensors='pt', padding='longest', truncation=False)
    
    # Check if input length exceeds the model's limit
    if tokens['input_ids'].shape[1] > 4096:
        print("Warning: Input length exceeds 4096 tokens. Truncating input, embeddings may be inaccurate.")
        tokens = tokenizer(text, return_tensors='pt', truncation=True, padding='max_length', max_length=4096)
    
    # Generate embeddings
    with torch.no_grad():  # Disable gradient calculation for inference
        outputs = model(**tokens)
        
        # Perform mean pooling: average the token embeddings
    token_embeddings = outputs.last_hidden_state  # Shape: [batch_size=1, sequence_length, hidden_size]
    mean_pooled_embedding = torch.mean(token_embeddings, dim=1).squeeze()  # Shape: [hidden_size]
    
    return mean_pooled_embedding
   
# Load and process the PDF
pdf_text = extract_text_from_pdf('Vishaan_Khanna_CV-4.pdf')

embeddings = get_embeddings(pdf_text)

print(embeddings)
