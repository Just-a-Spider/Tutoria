# With Angular app as another image
# Step 1: Build the application
FROM node:22-alpine
WORKDIR /server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# With Angular app as static files in a NestJS app
# # Stage 1: Build the Angular client
# FROM node:22-alpine AS client-builder
# WORKDIR /client
# COPY ../client/package*.json ./
# RUN npm install
# COPY ../client .
# # Replace the environment file if needed
# RUN cp src/environments/environment.docker.ts src/environments/environment.prod.ts
# RUN cp src/environments/environment.docker.ts src/environments/environment.ts
# RUN npm run build

# # Stage 2: Build the NestJS application
# FROM node:22-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 3: Create the production image for NestJS with static files
# FROM node:22-alpine
# WORKDIR /app
# # Copy NestJS build
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./
# # Copy the Angular build into the NestJS "client-dist" folder
# COPY --from=client-builder /client/dist /app/client-dist
# CMD ["npm", "run", "start:prod"]
