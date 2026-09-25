# build both language versions and their preview images from the source file
FROM node:22-alpine AS build
WORKDIR /src
COPY limit.html build.mjs ./
COPY assets/ ./assets/
RUN node build.mjs

# serve them: English at /, Mongolian at /mn/
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/site/ /usr/share/nginx/html/
EXPOSE 8080
