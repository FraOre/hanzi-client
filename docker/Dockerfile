# BUILDER
# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS builder
# Set the working directory in the container
WORKDIR /application
# Copy the package.json and package-lock.json files to the container
COPY ../package*.json ./
# Install the dependencies
RUN npm install
# Copy the rest of the application code to the container
COPY . .
# Build the application
RUN npm run build

# HOSTING
# Use the official Nginx image as the base image for the final image
FROM nginx:stable-alpine
# Copy the built React application from the previous stage to the Nginx container
COPY --from=builder application/build /usr/share/nginx/html
# Expose port
EXPOSE 8000
# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]