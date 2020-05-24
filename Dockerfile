FROM node:alpine
WORKDIR /dist
COPY . .
RUN npm install --prod
VOLUME [ "/app/data" ]
ENV NODE_ENV=production
EXPOSE 3000
CMD [ "node", "dist/index.js" ]