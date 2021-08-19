FROM node:lts-alpine
ENV NODE_ENV=production
RUN mkdir /app
WORKDIR /app

COPY . .
RUN apk add --no-cache unzip
RUN yarn install --production

CMD ["yarn", "start"]
