FROM node:6.10.1

# Setup the directory we want to install the app to
RUN mkdir -p /code/express-rest

# Add the user that will own and run the node process
RUN groupadd -r dockergroup && useradd -r -g dockergroup -d /home/dockeruser -m -c "Docker image user" dockeruser && chown -R dockeruser:dockergroup /home/dockeruser

# Set our working directory
WORKDIR /code/express-rest

# Add all the files except those in the dockerignore
ADD . /code/express-rest

# Make our dockeruser the owner
RUN chown -R dockeruser:dockergroup /code

# Switch to be docker user
USER dockeruser

# Install all app dependencies
RUN npm install

# Run the app
CMD [ "npm", "start" ]
