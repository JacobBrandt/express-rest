# express-rest #

**R**ESTful **E**xpress **S**ervice using **T**ypescript

## What is this repository for? ###

This repository can be used to quickly bring up a RESTful node server that connects to a Mongo database.  Abstract classes exist to quickly add new data models, routes, and services.  Each route added in this way will be protected by default through the authentication middleware.  Just inject your own preferred authentication strategy and implement the stubbed method.  In addition to having routes pre-wired to an authentication middleware they can also be overriden to extend this authentication to be permission/role based or removed entirely.

#

## How do I get set up? ###

#### Summary
* Clone repo
* Set configuration (Change admin user, server name)
* Launch docker containers
* [Check Service](http://localhost:5000)

#### Configuration
* You can change the server name in src/config/server.ts
* Admin user can be changed in src/config/app.ts
* Logging options can be changed in src/config/logging.ts

#### Adding node dependencies
* Whenever a new node module dependency is added you will need to rebuild the docker container image

#### Developing
* Nodemon is enabled to watch for changes to the src directory.  Changes will cause the service to restart when in development mode.

#### How to run tests?
* npm test

#

## Contribution guidelines

* New features should be accompanied by tests
* Code reviews will be required by all pull requests
* Follow the linting rules provided in this project

#

## Who do I talk to? ###

* Submit issues on this repo for all inquiries
