FROM node:20-slim AS base

# 接收 docker-compose 传递的 NODE_OPTIONS（仅内存参数）
ARG NODE_OPTIONS
ENV NODE_OPTIONS=$NODE_OPTIONS 

# 预先安装 Yarn 并启用 corepack
RUN corepack enable && corepack prepare yarn@4.12.0 --activate

WORKDIR /app

# 先复制包配置文件（利用 Docker 缓存）
COPY package.json yarn.lock* .yarnrc.yml ./

# ========== 关键修复：Yarn 4.x 正确的镜像配置 ==========
RUN   yarn install   # 有 yarn.lock 用这个，无则删除 --immutable

# 复制全部代码
COPY . .

# 构建生产包（Node 20 兼容的 V8 优化）
ENV NODE_ENV=production
ENV V8_FLAGS="--jitless"  
RUN yarn build 

# Nginx 部署阶段（保留你的原有配置）
FROM nginx:alpine
LABEL MAINTAINER="bypanghu@163.com"
COPY --from=base /app/.docker-compose/nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=base /app/dist /usr/share/nginx/html