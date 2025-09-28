# Multi-stage Dockerfile for building and serving the Vite React app

# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install only production dependencies deterministically
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime Stage ----
FROM nginx:1.27-alpine AS runner

# Copy nginx configuration (SPA-friendly)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Basic healthcheck (optional but useful)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -q -O - http://127.0.0.1/ > /dev/null 2>&1 || exit 1

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
