FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock* ./
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 3001
CMD ["sh", "start.sh"]
