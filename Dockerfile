FROM node:alpine
WORKDIR /dist
COPY package*.json ./
RUN apk add --update python make g++ && rm -rf /var/cache/apk/*
RUN npm ci --only=production
COPY . .
EXPOSE 3100
CMD [ "node", "src/app.ts" ]