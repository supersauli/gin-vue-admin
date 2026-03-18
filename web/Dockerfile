FROM node:20-slim AS base

# 预先安装 Yarn 并启用 corepack
RUN corepack enable && corepack prepare yarn@4.12.0 --activate

WORKDIR /app

# 先复制所有必要的文件
COPY package.json yarn.lock* .yarnrc.yml ./
COPY . .

# 然后安装依赖
RUN yarn install

# 最后构建
RUN yarn build

FROM nginx:alpine
LABEL MAINTAINER="bypanghu@163.com"
COPY --from=base /app/.docker-compose/nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=base /app/dist /usr/share/nginx/html
