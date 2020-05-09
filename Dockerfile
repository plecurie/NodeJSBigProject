FROM node:14

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package*.json /usr/src/app/
RUN npm install
# RUN npm ci --only=production

COPY . /usr/src/app

EXPOSE 8080
CMD [ "npm", "start" ]
