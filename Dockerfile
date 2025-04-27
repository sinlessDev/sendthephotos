FROM node:22.15.0-slim AS base
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate
ENV NODE_ENV=production


FROM base AS build

WORKDIR /stp

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./assets/package.json ./assets/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm --filter @stp/assets build


FROM base AS prod

WORKDIR /stp

COPY --from=build /stp/dist /stp/
COPY --from=build /stp/assets/dist /stp/assets/dist
COPY ./assets/package.json ./assets/

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm --filter stp install --frozen-lockfile --prod

CMD ["node", "./main.js"]