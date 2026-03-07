FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose AdonisJS default port
EXPOSE 3333

# Start development server
CMD ["sh", "/app/docker-entrypoint.sh"]
