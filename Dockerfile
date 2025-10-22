FROM node:20-alpine
FROM node:20-alpine

WORKDIR /app


COPY package.json package-lock.json* ./
RUN npm ci


COPY . .


RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
