# Use NodeJS 20
FROM node:20 

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]