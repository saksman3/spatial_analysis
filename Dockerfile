# 1st stage
FROM tiangolo/node-frontend:10 as build
# FROM node:12.2.0-alpine  as build
WORKDIR /app
COPY package*.json ./
#COPY yarn.lock ./

RUN npm install

RUN export NODE_OPTIONS=--openssl-legacy-provider 

COPY . /app

RUN npm run build

#final stage deployment
FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html
#COPY nginx.conf ./etc/nginx/conf.d/default.conf
COPY --from=build /nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]