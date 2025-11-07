# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package metadata first for better caching
COPY package.json package-lock.json ./

# Install dependencies using npm (uses package-lock.json)
# Use --legacy-peer-deps to avoid ERESOLVE peer dependency failures during image build
# (safe for build artifacts; consider fixing upstream deps long-term)
RUN npm ci --legacy-peer-deps

# Copy rest of the application source
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start Next.js app
CMD ["npm", "start"]