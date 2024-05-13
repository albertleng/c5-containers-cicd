FROM node:16-alpine
WORKDIR /my-app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]