FROM node:20.11.1-alpine AS dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM node:20.11.1-alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Eliminar node_modules y package-lock.json para que se instale todo desde cero
RUN rm -rf node_modules package-lock.json

# Instalar dependencias de nuevo
RUN npm install

# Instalar la versión correcta de esbuild
RUN npm install esbuild@0.20.2

# Ejecutar el build
RUN npm run build

FROM nginx:stable-alpine3.21-perl AS prod
EXPOSE 80
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD [ "nginx", "-g", "daemon off;" ]

