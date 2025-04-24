FROM node:20.11.1-alpine AS dev-deps
WORKDIR /app
COPY package.json package.json
RUN npm install


FROM node:20.11.1-alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# RUN yarn test
RUN npm run build


FROM nginx:stable-alpine3.21-perl AS prod
EXPOSE 80
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD [ "nginx","-g","daemon off;"]
