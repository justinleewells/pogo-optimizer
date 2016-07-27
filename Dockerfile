FROM node

RUN apt-get update -qq
RUN apt-get install -yqq libprotobuf-dev

# Setup PATH to prioritize local npm bin ahead of system PATH.
ENV PATH node_modules/.bin:$PATH

RUN mkdir /code
WORKDIR /code

ADD . /code/

RUN npm install --silent
RUN GIT_DIR=/tmp bower install --allow-root --silent

EXPOSE 8081
EXPOSE 3000

CMD npm start
