# Render requires an ASCII Dockerfile path. The level snapshots keep their names.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY ["9уровень/package.json", "9уровень/package-lock.json", "./"]
RUN npm ci
COPY ["9уровень/", "./"]
RUN npm run build && node scripts/export-fixtures.mjs

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules/postgres ./node_modules/postgres
COPY --from=build /app/scripts ./scripts
COPY --from=build /app/database ./database
COPY --from=build /app/package.json ./package.json
EXPOSE 3000
USER node
CMD ["node", "scripts/start.mjs"]
