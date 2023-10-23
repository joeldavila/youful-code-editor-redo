# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./collaborative-code-editor/ ./collaborative-code-editor/
COPY ./server.js ./server.js

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install 
    # && npm install -g serve 
    # && npm run build \
    # && rm -fr node_modules

EXPOSE 3000
EXPOSE 8080

# Start the app using serve command
CMD ["npm", "start"]