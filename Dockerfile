# Specify base image
FROM node:14

# Set working directory in docker container
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application to the working directory
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the app
CMD [ "node", "main.js" ]
