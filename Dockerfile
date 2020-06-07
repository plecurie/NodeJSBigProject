FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY ./build ./

RUN apk add --update python-dev python make g++ && rm -rf /var/cache/apk/*

RUN npm ci --only=production --silent && mv node_modules ../

COPY . .

EXPOSE 3100

CMD [ "node", "dist/index.js" ]
