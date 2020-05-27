FROM node:alpine

COPY package*.json ./
COPY tsconfig.json ./
COPY dist ./dist

WORKDIR /usr/src/app

RUN npm install

EXPOSE 3100:3100
EXPOSE 9200:9200