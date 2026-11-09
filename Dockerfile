# Railway builds this instead of using its default builder (railpack), which
# was timing out downloading its Node installer from GitHub. Docker pulls the
# Node image from Docker Hub instead.
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile=false
COPY . .
# Build client (vite) + server (esbuild). Schema push happens at start, when DATABASE_URL exists.
RUN pnpm vite build && pnpm esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable
COPY --from=build /app/package.json /app/pnpm-lock.yaml* ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
EXPOSE 3000
# Apply any new tables/columns, then start. (drizzle-kit is a devDependency, kept in node_modules above.)
CMD ["sh", "-c", "pnpm drizzle-kit push --force && node dist/index.js"]
