FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --no-cache python py-pip python-dev make g++ && rm -rf /var/cache/apk/* && pip install docker-compose
RUN npm ci --only=production --silent && mv node_modules ../
COPY . .
EXPOSE 3100
EXPOSE 9200
CMD [ "node", "dist/index.js" ]