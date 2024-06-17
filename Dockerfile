FROM node

FROM node:20.11.0

LABEL maintainer="Rutarj Shah <rshah103@myseneca.ca>"
LABEL description="Fragmnets Microsoervice"

ENV PORT=8080

ENV NPM_CONFIG_LOGLEVEL=warn


ENV NPM_CONFIG_COLOR=false


WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start

EXPOSE 8080


