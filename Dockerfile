# ==========================================
# Multi-Stage Dockerfile for High-Performance SPA
# Stage 1: Build & Test Environment
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Cache package manifests for layer reusability
COPY package*.json ./

# Install clean dependencies
RUN npm ci --prefer-offline --no-audit

# Copy source code and configurations
COPY . .

# Run automated lint verification and unit tests in build stage
RUN npm run lint
RUN npm run test

# Compile production-optimized static bundle
RUN npm run build

# ==========================================
# Stage 2: Production NGINX Web Server
# ==========================================
FROM nginx:1.27-alpine-slim AS runner

# Label metadata for OCI image specifications
LABEL maintainer="Abhijit Uday Naik <naikabhi081004@gmail.com>"
LABEL org.opencontainers.image.title="Containerized Web Application"
LABEL org.opencontainers.image.description="Multi-stage production NGINX containerized frontend application"
LABEL org.opencontainers.image.version="1.0.0"

# Remove default NGINX welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy high-performance NGINX configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Copy compiled SPA bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Grant appropriate permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

# Container port exposure
EXPOSE 80

# Production Healthcheck against NGINX health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
