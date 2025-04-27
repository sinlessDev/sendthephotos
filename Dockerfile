FROM node:22-slim AS base

RUN corepack enable


FROM base AS build

WORKDIR /sendthephotos

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm tsc
RUN cd assets && pnpm vite build


FROM base AS prod

WORKDIR /app

COPY --from=build /sendthephotos/dist /app/
COPY --from=build /sendthephotos/assets/dist /app/public
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

CMD ["node", "./main.js"]