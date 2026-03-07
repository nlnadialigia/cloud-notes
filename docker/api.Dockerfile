FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm --filter api build

CMD ["node","apps/api/dist/main.js"]