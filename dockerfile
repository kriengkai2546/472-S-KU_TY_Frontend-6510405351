# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application code
COPY . .

# Next.js build
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]