FROM node:12-alpine AS development
ENV NODE_ENV development
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build

FROM node:12-alpine as production
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY . .
RUN npm install -g typeorm
RUN typeorm migration:run 
RUN npm install
RUN npm run build
