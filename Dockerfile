# Select node version
FROM node:16.19

# Create app directory
WORKDIR /app

# Copy package.json
COPY package*.json ./

COPY .npmrc ./

# Install this manually
RUN yarn add gsap@npm:@gsap/business

# Install dependencies
RUN yarn

# Bundle app source
COPY . .

EXPOSE 8085

# Run app
CMD [ "yarn", "start" ] 

