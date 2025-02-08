# Use an official lightweight Node.js image.
FROM node:18-alpine

# Set the working directory inside the container.
WORKDIR /app

# Copy package files first for dependency caching.
COPY package*.json ./

# Install only production dependencies.
RUN npm install --production

# Copy the rest of the application code.
COPY . .

# Expose port 3000 to allow the container to be accessed externally.
EXPOSE 3000

# Define the command to run your application.
CMD ["node", "final1.js"]
