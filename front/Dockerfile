# Use Node.js 20 alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose Vite's default dev port
EXPOSE 5173

# Start Vite with --host to allow external access (from container to host)
CMD ["npm", "run", "dev", "--", "--host"]
