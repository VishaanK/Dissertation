import torch
from transformers import AutoTokenizer, AutoModel
import PyPDF2
import pandas as pd
import numpy as np
import umap
import datashader
import bokeh 
import holoviews
import matplotlib.pyplot as plt
import umap.plot
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
    
    with torch.no_grad():  # Disable gradient calculation for inference
        outputs = model(**tokens)
        
    # Perform mean pooling: average the token embeddings
    #make sure that this is the pre softmax layer 
    token_embeddings = outputs.last_hidden_state  # Shape: [batch_size=1, sequence_length, hidden_size]
    mean_pooled_embedding = torch.mean(token_embeddings, dim=1).squeeze()  # Shape: [hidden_size]
    
    #normalize 
    doc_vectors_normalized = torch.nn.functional.normalize(mean_pooled_embedding,p=2.0,dim=0)
    # Convert the tensor to a list (JSON-compatible format)
    embedding_list = doc_vectors_normalized.tolist()
    
    return embedding_list



#place the embedding on a graph 

def plotEmbeddings(embeddings): 
    print(embeddings.shape)
    reducer = umap.UMAP()
    embedding = reducer.fit_transform(embeddings)
    
    # Plotting the resulting 2D point
    plt.figure(figsize=(8, 6))
    plt.scatter(embedding[:, 0], embedding[:, 1], c='blue', label="Document Embedding")
    plt.title("UMAP Projection of Document Embedding")
    plt.xlabel("UMAP Dimension 1")
    plt.ylabel("UMAP Dimension 2")
    plt.legend()
    plt.grid(True)
    plt.show()
    
    
# Load and process the PDF
documents = ['Vishaan_Khanna_CV-4.pdf','Vishaan_Khanna_CV-3.pdf']
pdf_texts = [] 
embeddings = []
for n in documents:
   pdf_texts.append(extract_text_from_pdf(n))

for pdf in pdf_texts:
    embeddings.append(get_embeddings(pdf))

print(len(embeddings))

plotEmbeddings(embeddings)