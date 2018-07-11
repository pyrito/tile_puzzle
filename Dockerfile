FROM node:alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 3000
RUN npm install -g nodemon
CMD [ "nodemon" ]
