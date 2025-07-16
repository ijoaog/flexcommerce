# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json tsconfig.json ./

# Cache inteligente com BuildKit
RUN --mount=type=cache,id=flexcommerce-npm-cache,target=/root/.npm \
    npm ci --omit=dev --prefer-offline --no-audit

COPY . .

ENV NEXT_DISABLE_SOURCEMAPS=true
RUN npm run build

# Etapa 2: Runtime enxuto
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]