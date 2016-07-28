FROM node

RUN apt-get update -qq && apt-get install -yqq \
    libprotobuf-dev

# Setup PATH to prioritize local npm bin ahead of system PATH.
ENV PATH node_modules/.bin:$PATH

RUN mkdir /code
WORKDIR /code

COPY package.json /code/
RUN SKIP_POSTINSTALL=1 npm install --silent

COPY .bowerrc /code/
COPY bower.json /code/
RUN GIT_DIR=/tmp bower install --allow-root --silent

# Generate .http-mitm-proxy
RUN ["node", "-e", "require('http-mitm-proxy')().listen({}, function () {process.exit();});"]

COPY . /code/

EXPOSE 8081
EXPOSE 3000

CMD npm start
