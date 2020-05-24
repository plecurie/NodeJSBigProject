FROM node:alpine
WORKDIR /dist
COPY package*.json ./
RUN apk add --update python make g++ && rm -rf /var/cache/apk/*
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD [ "node", "dist/index.js" ]