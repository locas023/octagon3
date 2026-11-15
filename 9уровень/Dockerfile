FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY scripts ./scripts
COPY database ./database
COPY server/utils/mock-data.ts ./server/utils/mock-data.ts
COPY package.json ./package.json
EXPOSE 3000
USER node
CMD ["node", ".output/server/index.mjs"]

