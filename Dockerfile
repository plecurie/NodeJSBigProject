FROM node:alpine
WORKDIR /dist
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD [ "node", "dist/index.js" ]