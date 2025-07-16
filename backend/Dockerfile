# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN --mount=type=cache,id=flexcommerce-npm-cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

# Etapa 2: Execução segura e enxuta
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

RUN npm ci --omit=dev --prefer-offline --no-audit \
    && npm prune --omit=dev \
    && rm -rf /root/.npm

EXPOSE 3003
CMD ["node", "dist/main"]