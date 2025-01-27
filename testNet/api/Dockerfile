# Use Node.js base image
FROM node:23.0.0

# Update apt package list and install Python 3, pip, and venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    rm -rf /var/lib/apt/lists/*  # Clean up to reduce image size

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv

# Add Python virtual environment to PATH
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies inside the virtual environment
RUN pip install --no-cache-dir torch transformers pypdf2 

# Set the working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY dist/ /app/  

# Expose the port the application will run on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "app.js"]
