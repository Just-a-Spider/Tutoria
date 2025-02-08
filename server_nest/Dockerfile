# # With Angular app as another image
# # Step 1: Build the application
# FROM node:22-alpine
# WORKDIR /server
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# -------------------------------------------------------------------------------------------
# With Angular app as static files in a NestJS app
# Stage 1: Build the Angular client
FROM node:22-alpine AS client-builder
WORKDIR /client
COPY ../client/package*.json /client
RUN npm install
COPY ../client /client
RUN npm run build

# Stage 2: Build the NestJS application
FROM node:22-alpine
WORKDIR /server
COPY ../server_nest/package*.json /server
# Copy the Angular client build output to the server
COPY --from=client-builder /client/dist /server/static
RUN npm install
COPY ../server_nest /server
RUN npm run build