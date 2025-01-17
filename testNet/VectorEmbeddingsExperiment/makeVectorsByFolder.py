import os
import torch
from transformers import AutoTokenizer, AutoModel
import PyPDF2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA  
from sklearn.manifold import TSNE


# Step 1: Load the PDF and extract text
def extract_text_from_pdf(pdf_path):
    """
    extract the pdf text from the pdf
    Parameters:
        pdf_path : the file path 
    """
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''.join([page.extract_text() or "" for page in reader.pages])
    return text

#load the model
tokenizer = AutoTokenizer.from_pretrained("allenai/longformer-base-4096")
model = AutoModel.from_pretrained("allenai/longformer-base-4096")
print("model : allenai/longformer-base-4096")
def get_embeddings(text):
    """
    extract the embeddings
    Parameters:
        text : the text to process
    """
    # Tokenise
    tokens = tokenizer(text, return_tensors='pt', padding='longest', truncation=False)
    
    # Check if input length exceeds the model's limit
    if tokens['input_ids'].shape[1] > 4096:
        print("Warning: Input length exceeds 4096 tokens. Truncating input, embeddings may be inaccurate.")
        tokens = tokenizer(text, return_tensors='pt', truncation=True, padding='max_length', max_length=4096)
    
    with torch.no_grad():  # Disable gradient calculation for inference
        outputs = model(**tokens)
        
    # Average the token embeddings
    token_embeddings = outputs.last_hidden_state 
    mean_pooled_embedding = torch.mean(token_embeddings, dim=1).squeeze()
    
    #normalize 
    doc_vectors_normalized = torch.nn.functional.normalize(mean_pooled_embedding,p=2.0,dim=0)
   # convert to list
    embedding_list = doc_vectors_normalized.tolist()
    
    return embedding_list



def calculate_euclidean_distances(embeddings,label):
    """
    Calculate and print the Euclidean distances

    Parameters:
        embeddings : list of embeddings
    """
    embeddings_array = np.array(embeddings)

    # Compute Euclidean distances
    num_embeddings = len(embeddings_array)
    distances = np.zeros((num_embeddings, num_embeddings))

    for i in range(num_embeddings):
        for j in range(num_embeddings):
            distances[i, j] = euclidean(embeddings_array[i], embeddings_array[j])

    # Print distances
    print("Euclidean Distances between Document Embeddings:")
    for i in range(num_embeddings):
        for j in range(num_embeddings):
            if i != j:
                print(f"Distance between Document {label[i]} and Document {label[j]}: {distances[i, j]:.4f}")

def plotWithAmplifiedTSNE(embeddings, labels, scale_factor=1, perplexity=1, n_iter=1000):
    """
    Plot with TSNE

    Parameters:
        embeddings : list of embeddings
        labels : List of labels corresponding to each embedding.
        scale_factor : Factor to scale Tsne
        perplexity : perplexity hyper-parameter
        n_iter : Number of iterations for t-SNE
    """ 
 
    # Perform t-SNE
    tsne = TSNE(n_components=2, perplexity=perplexity, n_iter=n_iter, random_state=42)
    reduced_embeddings = tsne.fit_transform(embeddings) 
    
    # Amplify the differences by applying a scaling factor
    amplified_embeddings = reduced_embeddings * scale_factor
    
    # Assign a unique color to each label
    unique_labels = list(set(labels))
    colors = plt.cm.get_cmap('tab10', len(unique_labels)) 
    color_map = {label: colors(i) for i, label in enumerate(unique_labels)}

    # Plot the amplified t-SNE results
    plt.figure(figsize=(10, 8))

    for i, label in enumerate(labels):
        plt.scatter(amplified_embeddings[i, 0], amplified_embeddings[i, 1],
                    color=color_map[label], s=100, label=label if label not in plt.gca().get_legend_handles_labels()[1] else None)


    # Add plot details
    plt.title(f"t-SNE Projection of Embeddings)", fontsize=16)
    plt.xlabel("Amplified t-SNE Dimension 1", fontsize=14)
    plt.ylabel("Amplified t-SNE Dimension 2", fontsize=14)
    plt.grid(True)
    plt.legend(loc='best', fontsize=10)
    plt.show()

# lists of folders to process
folders = ['./TestData/ContractAndOpposite','./TestData/ParagraphTests','./TestData/Story','./TestData/SingleDocVersions']

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
            labels.append(str(filename))
            embeddings.append(get_embeddings(extract_text_from_pdf(file_path)))



    #here i now have an array of the vector embeddings which have been normalised
    embeddings_array = np.stack(embeddings)
    num = len(embeddings_array) - 1
    plotWithAmplifiedTSNE(embeddings_array,labels,perplexity=num)
    calculate_euclidean_distances(embeddings_array,labels)
