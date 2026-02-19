# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# ARGs for build-time variables (Vite needs these during build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_GEMINI_API_KEY
ARG VITE_ALLOWED_DOMAIN

# Pass ARGs to ENV for the build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_ALLOWED_DOMAIN=$VITE_ALLOWED_DOMAIN

# Build the frontend (dist folder)
RUN npm run build

# Build the backend (server/dist folder)
RUN npm run server-build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server/dist ./server/dist
# Note: drive-key.json must be in the container. 
# We'll copy it from the context (it's in .gitignore for git but available to docker context)
COPY drive-key.json ./

# Expose port (Cloud Run will set PORT env variable)
ENV PORT=8080
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
