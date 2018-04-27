FROM node:alpine

EXPOSE 7777

ADD . /app

WORKDIR /app

RUN npm install

ENTRYPOINT node app.js
