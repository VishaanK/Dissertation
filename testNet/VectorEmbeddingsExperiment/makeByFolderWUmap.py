import os
import torch
from transformers import AutoTokenizer, AutoModel
import PyPDF2
import pandas as pd
import numpy as np
import umap
import matplotlib.pyplot as plt
import umap.plot
from sklearn.decomposition import PCA
from scipy.cluster.hierarchy import dendrogram, linkage
from sklearn.preprocessing import StandardScaler

# Step 1: Load the PDF and extract text
def extract_text_from_pdf(pdf_path):
    """
    extract the pdf text from the pdf at the file path provided 
    Parameters:
        pdf_path : the file path 
    """
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''.join([page.extract_text() or "" for page in reader.pages])
    return text

# Step 2: Load the Longformer tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("nlpaueb/legal-bert-base-uncased")
model = AutoModel.from_pretrained("nlpaueb/legal-bert-base-uncased")

def get_embeddings(text):
    """
    extract the embedding from the text provided
    Parameters:
        text : the text to process
    """
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


import numpy as np
import umap
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder
from matplotlib.colors import ListedColormap

def plot_umap(vectors, labels, n_neighbors=2, min_dist=0.5, n_components=2):
    """
    Reduces the dimensionality of the input vectors using UMAP and plots the result.

    Parameters:
    - vectors: numpy array of shape [number of vectors, number of dimensions]
    - labels: array of labels corresponding to each vector
    - n_neighbors: int, number of neighbors for UMAP (default: 2)
    - min_dist: float, minimum distance between points in UMAP projection (default: 0.0)
    - n_components: int, target dimensionality of the projection (default: 2)
    """
    # Validate input
    if len(vectors) != len(labels):
        raise ValueError("The number of vectors and labels must be the same.")

    # Encode labels to integers if they are not numeric
    label_encoder = LabelEncoder()
    numeric_labels = label_encoder.fit_transform(labels)

    # Apply UMAP
    reducer = umap.UMAP(n_neighbors=n_neighbors, min_dist=min_dist, n_components=n_components, random_state=42)
    embedding = reducer.fit_transform(vectors)

    # Plot the result
    plt.figure(figsize=(10, 8))

    # Create a scatter plot, color by labels
    scatter = plt.scatter(
        embedding[:, 0], 
        embedding[:, 1], 
        c=numeric_labels, 
        cmap="Spectral", 
        s=50, 
        alpha=0.8
    )

    # Modify legend creation to preserve the order of appearance
    unique_labels = list(dict.fromkeys(labels))  # Keep labels in their input order
    handles = [plt.Line2D([0], [0], marker='o', color=scatter.cmap(scatter.norm(i)), linestyle='') 
            for i in range(len(unique_labels))]
    plt.legend(handles, unique_labels, title="Labels", loc="best", fontsize="medium")
    
    # Add titles and labels
    plt.title("UMAP Projection", fontsize=16)
    plt.xlabel("UMAP-1", fontsize=12)
    plt.ylabel("UMAP-2", fontsize=12)
    plt.grid(True, alpha=0.5)
    
    # Show plot
    plt.show()


# Load and process the PDF
folders = ['./TestData/ContractAndOpposite','./TestData/SingleDocVersions']

for folder in folders:

    embeddings = []
    labels = []

    # Iterate over the files in the folder
    for filename in os.listdir(folder):
        # Get the full path of the file
        file_path = os.path.join(folder, filename)
        
        # Check if it is a file (not a directory)
        if os.path.isfile(file_path):
            print(f"Processing file: {filename}")
            # Add your processing code here
            labels.append(str(filename))
            embeddings.append(get_embeddings(extract_text_from_pdf(file_path)))



    #here i now have an array of the vector embeddings which have been normalised
    embeddings_array = np.stack(embeddings)
    num = len(embeddings_array) - 1

    plot_umap(embeddings_array,labels,n_neighbors=num)
    