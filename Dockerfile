FROM node:22-slim AS base

RUN corepack enable
RUN corepack prepare pnpm@10.9.0 --activate


FROM base AS build

WORKDIR /stp

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY assets/package.json ./assets/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm tsc && cd assets && pnpm vite build


FROM base AS prod

WORKDIR /stp

COPY --from=build /stp/dist /stp/
COPY --from=build /stp/assets/dist /stp/public

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

CMD ["node", "./main.js"]