# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production=false

# Copy source code
COPY . .

# Build TypeScript
RUN yarn build

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "dist/app.js"] 