# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


