# # Stage 1: Build the application
# FROM node:22-alpine AS builder
# WORKDIR /client
# COPY package*.json ./
# ARG SERVER_URL
# ENV SERVER_URL=${SERVER_URL}
# RUN npm install
# COPY . .
# # Replace the environment files using the provided build arg
# RUN node update-env.js
# RUN npm run build

# # Stage 2: Run the application
# FROM node:22-alpine
# WORKDIR /client
# COPY --from=builder /client/dist ./dist
# COPY package*.json ./
# COPY server.js ./
# RUN npm install --omit=dev

# Build for development
FROM node:22-alpine
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install -g @angular/cli
