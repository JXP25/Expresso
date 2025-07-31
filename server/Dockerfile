FROM node:21

# Install Python and pip for mediasoup build
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the ports needed by mediasoup
EXPOSE 4444
EXPOSE 3016 

# Start the server
CMD ["yarn", "devl"]
