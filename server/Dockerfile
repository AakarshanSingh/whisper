FROM node:21-alpine

WORKDIR /service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "node", "server.js"]