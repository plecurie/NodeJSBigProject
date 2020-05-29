FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json /usr/src/app

RUN npm ci --only=production --silent && mv node_modules ../

COPY . /usr/src/app

EXPOSE 3100

CMD [ "npm", "start" ]
