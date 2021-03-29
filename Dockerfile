FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 8001
CMD ["node", "app.js"]