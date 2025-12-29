# ---------- Base ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# ---------- Runtime ----------
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

# Copy only what is needed
COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 4000

CMD ["node", "src/index.js"]