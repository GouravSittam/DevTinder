FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV SERVER_ENV=production
CMD ["npm", "run", "start"]
