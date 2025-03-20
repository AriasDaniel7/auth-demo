FROM node:22.13.1

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:prod"]