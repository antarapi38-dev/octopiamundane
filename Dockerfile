# Use an official Node runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Vite React application
RUN npm run build

# Expose the port the app runs on (Render/Back4App use process.env.PORT)
EXPOSE 3000

# Run the command to start the application
CMD ["npm", "start"]
