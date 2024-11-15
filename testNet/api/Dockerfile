# Use Node.js base image
FROM node:23.0.0

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
CMD ["node", "start"]