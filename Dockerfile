FROM node:20-alpine
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client and run migrations
RUN npx prisma generate
RUN npx prisma migrate deploy

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]