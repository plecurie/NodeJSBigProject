FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production --silent && mv node_modules ../

COPY . .

EXPOSE 3100

CMD [ "node", "dist/index.js" ]
