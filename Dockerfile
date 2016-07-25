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

CMD npm start& \
sleep 10; \
openssl x509 -inform PEM -outform DM -in /code/.http-mitm-proxy/certs/ca.pem -out /code/.http-mitm-proxy/certs/ca.crt; \
sleep infinity
