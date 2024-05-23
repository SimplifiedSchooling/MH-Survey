FROM node:alpine

RUN mkdir -p /usr/src/mh-survey && chown -R node:node /usr/src/mh-survey

WORKDIR /usr/src/mh-survey

COPY package.json ./

USER node

RUN npm install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 3000
