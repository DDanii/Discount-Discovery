ARG NODE_VERSION=24.7.0

FROM node:${NODE_VERSION}-slim AS base

ARG PORT=3000

WORKDIR /src

RUN apt-get update -y && apt-get install -y openssl

# Build
FROM base AS build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

RUN npm run build

RUN npx prisma generate 

# Run
FROM base

ENV PORT=$PORT
ENV NODE_ENV=production
ENV DATABASE_URL="file:/config/database.db"

RUN npm install prisma

COPY --from=build /src/.output /src/.output
COPY --from=build /src/prisma /src/prisma
COPY --from=build /src/node_modules/_db /src/node_modules/_db
COPY --from=build /src/store /src/store

EXPOSE $PORT

CMD [ "node", ".output/server/index.mjs" ]