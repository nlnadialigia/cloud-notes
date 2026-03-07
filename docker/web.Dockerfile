FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm --filter web build

CMD ["pnpm","--filter","web","start"]