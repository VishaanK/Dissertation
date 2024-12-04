# Use Node.js base image
FROM node:23.0.0

# Update apt package list and install Python 3, pip, and venv
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv

# Make sure to use the virtual environment's pip and python
ENV PATH="/opt/venv/bin:$PATH"

# Install Python dependencies inside the virtual environment
RUN pip install --no-cache-dir torch transformers pypdf2

WORKDIR /app

COPY package*.json .

# Set working directory

# Copy package.json and install dependencies

RUN npm install

# Copy the rest of the application
COPY dist/* .

# Expose the port the app runs on
EXPOSE 3000

# Use the startup script to run the app
CMD ["node", "app.js"]