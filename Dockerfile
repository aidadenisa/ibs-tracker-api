# Instructions for building a docker image

# Specify the base image with Node.js pre-installed
# Docker Alpine is the “Dockerized” version of Alpine Linux, 
# a Linux distribution known for being exceptionally lightweight and secure.
FROM node:18-alpine

# Set the working directory inside the container
# This also switches the current directory to /app
WORKDIR /app

# copy dependency files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port on which your app runs
EXPOSE 3030

# Define the comman to run the app
CMD [ "yarn", "start"]
