FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN apk add --update python make g++ && rm -rf /var/cache/apk/*
RUN npm ci --only=production
COPY . .
EXPOSE 3100
CMD [ "node", "dist/index.js" ]