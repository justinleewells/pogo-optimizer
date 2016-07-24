FROM node

RUN apt-get update -qq
RUN apt-get install -yqq libprotobuf-dev
RUN npm install -g --silent bower
RUN npm install -g --silent gulp

RUN mkdir /code
WORKDIR /code

ADD . /code/

RUN npm install --silent
RUN GIT_DIR=/tmp bower install --allow-root --silent

EXPOSE 8081
EXPOSE 3000

CMD npm start
