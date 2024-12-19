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
tokenizer = AutoTokenizer.from_pretrained("allenai/longformer-base-4096-extra.pos.embd.only")
model = AutoModel.from_pretrained("allenai/longformer-base-4096-extra.pos.embd.only")

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



import torch
import numpy as np
from scipy.spatial.distance import euclidean
def calculate_cosine_similarity_dot(embeddings, label):
    """
    Calculate and print the Cosine Similarity between pairs of document embeddings.

    Parameters:
        embeddings (list or numpy.ndarray): A list of normalized embeddings or a 2D numpy array of shape [n_samples, embedding_dim].
    """
    embeddings_array = np.array(embeddings)

    # Compute pairwise Cosine Similarity using dot product
    num_embeddings = len(embeddings_array)
    similarities = np.zeros((num_embeddings, num_embeddings))

    for i in range(num_embeddings):
        for j in range(num_embeddings):
            dot_product = np.dot(embeddings_array[i], embeddings_array[j])
            similarities[i, j] = dot_product

    # Print similarities
    print("Cosine Similarity between Document Embeddings:")
    for i in range(num_embeddings):
        for j in range(num_embeddings):
            if i != j:
                print(f"Similarity between Document {label[i]} and Document {label[j]}: {similarities[i, j]:.4f}")

import numpy as np

def calculate_cosine_similarity(embeddings, labels):
    """
    Calculate and print the Cosine Similarity between pairs of document embeddings.

    Parameters:
        embeddings (list or numpy.ndarray): A list of normalized embeddings or a 2D numpy array of shape [n_samples, embedding_dim].
        labels (list): A list of labels corresponding to each embedding.
    """
    embeddings_array = np.array(embeddings)

    # Compute pairwise Cosine Similarity
    num_embeddings = len(embeddings_array)
    similarities = np.zeros((num_embeddings, num_embeddings))

    for i in range(num_embeddings):
        for j in range(num_embeddings):
            dot_product = np.dot(embeddings_array[i], embeddings_array[j])
            norm_i = np.linalg.norm(embeddings_array[i])
            norm_j = np.linalg.norm(embeddings_array[j])
            similarities[i, j] = dot_product / (norm_i * norm_j)

    # Print similarities
    print("Cosine Similarity between Document Embeddings:")
    for i in range(num_embeddings):
        for j in range(num_embeddings):
            if i != j:
                print(f"Similarity between Document {labels[i]} and Document {labels[j]}: {similarities[i, j]:.4f}")

def calculate_euclidean_distances(embeddings,label):
    """
    Calculate and print the Euclidean distances between pairs of document embeddings.

    Parameters:
        embeddings (list or numpy.ndarray): A list of normalized embeddings or a 2D numpy array of shape [n_samples, embedding_dim].
    """
    embeddings_array = np.array(embeddings)

    # Compute pairwise Euclidean distances
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
    Plot embeddings using t-SNE with amplified scale for better visualization.

    Parameters:
        embeddings (list or numpy.ndarray): List of embedding vectors or 2D numpy array of shape [n_samples, embedding_dim].
        labels (list): List of labels corresponding to each embedding.
        scale_factor (float): Factor to scale the t-SNE-transformed coordinates.
        perplexity (int): The perplexity parameter for t-SNE, controlling the balance between local and global structure.
        n_iter (int): Number of iterations for t-SNE optimization.
    """ 
    
    from sklearn.manifold import TSNE
    import matplotlib.pyplot as plt
    import numpy as np

    # Perform t-SNE to reduce to 2 dimensions
    tsne = TSNE(n_components=2, perplexity=perplexity, n_iter=n_iter, random_state=42)
    reduced_embeddings = tsne.fit_transform(embeddings)  # Shape: [n_samples, 2]
    
    # Amplify the differences by applying a scaling factor
    amplified_embeddings = reduced_embeddings * scale_factor
    
    # Assign a unique color to each label
    unique_labels = list(set(labels))
    colors = plt.cm.get_cmap('tab10', len(unique_labels))  # Using distinct colors from colormap
    color_map = {label: colors(i) for i, label in enumerate(unique_labels)}

    # Plot the amplified t-SNE results
    plt.figure(figsize=(10, 8))

    for i, label in enumerate(labels):
        plt.scatter(amplified_embeddings[i, 0], amplified_embeddings[i, 1],
                    color=color_map[label], s=100, label=label if label not in plt.gca().get_legend_handles_labels()[1] else None)

        # Annotate points with slight offsets to reduce overlap
        plt.annotate(label,
                     (amplified_embeddings[i, 0], amplified_embeddings[i, 1]),
                     fontsize=10, alpha=0.75)

    # Add plot details
    plt.title(f"t-SNE Projection of Embeddings)", fontsize=16)
    plt.xlabel("Amplified t-SNE Dimension 1", fontsize=14)
    plt.ylabel("Amplified t-SNE Dimension 2", fontsize=14)
    plt.grid(True)
    plt.legend(loc='best', fontsize=10)
    plt.show()
import numpy as np
from scipy.stats import wasserstein_distance

def calculate_wasserstein_distances(embeddings, labels):
    """
    Calculate and print the Wasserstein distances (Earth Mover's Distance) between pairs of vectors.

    Parameters:
        embeddings (list or numpy.ndarray): A list or 2D numpy array of vectors.
        labels (list): A list of labels corresponding to the embeddings.
    """
    embeddings_array = np.array(embeddings)
    num_embeddings = len(embeddings_array)
    distances = np.zeros((num_embeddings, num_embeddings))

    # Compute pairwise Wasserstein distances
    for i in range(num_embeddings):
        for j in range(num_embeddings):
            distances[i, j] = wasserstein_distance(embeddings_array[i], embeddings_array[j])

    # Print distances
    print("Wasserstein Distances between Document Embeddings:")
    for i in range(num_embeddings):
        for j in range(num_embeddings):
            if i != j:
                print(f"Distance between {labels[i]} and {labels[j]}: {distances[i, j]:.4f}")

    return distances


# Load and process the PDF
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
            # Add your processing code here
            labels.append(str(filename))
            embeddings.append(get_embeddings(extract_text_from_pdf(file_path)))



    #here i now have an array of the vector embeddings which have been normalised
    embeddings_array = np.stack(embeddings)
    num = len(embeddings_array) - 1
    #when i change the perplexity I start to get very different looking results
    #plotWithAmplifiedTSNE(embeddings_array,labels,perplexity=num)
    calculate_euclidean_distances(embeddings_array,labels)

    #calculate_cosine_similarity(embeddings_array,labels)
    
    #calculate_wasserstein_distances(embeddings_array,labels)