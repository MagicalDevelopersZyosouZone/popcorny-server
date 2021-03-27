FROM node:15.12.0-alpine3.10
WORKDIR /app
COPY . /app
EXPOSE 5000
CMD npm start