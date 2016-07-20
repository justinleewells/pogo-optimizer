FROM node

RUN apt-get update -qq
RUN apt-get install -yqq libprotobuf-dev
RUN npm install -g --silent bower

RUN mkdir /code
WORKDIR /code

ADD . /code/

RUN npm install --silent
RUN bower install --allow-root --silent

EXPOSE 8081
EXPOSE 3000

CMD node index
