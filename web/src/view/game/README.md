
# 游戏管理模块

## 概述
游戏管理模块提供了对游戏玩家、用户和游戏数据的管理功能，包括玩家管理、用户管理、货币调整和英雄数据导入等功能。

## 模块结构

```
game/
├── index.vue          # 游戏管理入口页面
├── player/
│   └── index.vue      # 玩家管理页面
├── user/
│   └── index.vue      # 用户管理页面
└── admin/
    └── index.vue      # 游戏管理页面（货币调整、英雄数据导入）
```

## 功能说明

### 1. 玩家管理
- 查看玩家列表（分页）
- 创建新玩家
- 编辑玩家信息
- 删除玩家

### 2. 用户管理
- 查看用户列表（分页）
- 创建新用户
- 编辑用户信息
- 删除用户

### 3. 游戏管理
- 货币调整：调整用户的游戏货币（金币、钻石、体力等）
- 英雄数据导入：批量导入英雄数据

## API接口

### 玩家管理API
- `GET /api/v1/admin/players` - 获取玩家列表（分页）
- `POST /api/v1/admin/players/create` - 创建玩家
- `POST /api/v1/admin/players/delete` - 删除玩家
- `POST /api/v1/admin/players/update` - 更新玩家数据

### 用户管理API
- `GET /api/v1/admin/users` - 获取用户列表（分页）
- `POST /api/v1/admin/users/create` - 创建用户
- `POST /api/v1/admin/users/delete` - 删除用户
- `POST /api/v1/admin/users/update` - 更新用户信息

### 游戏管理API
- `POST /api/v1/admin/currency/adjust` - 调整用户货币
- `POST /api/v1/admin/gacha/import_heroes` - 导入英雄数据

## 使用说明

1. 在系统菜单中添加"游戏管理"菜单项
2. 为相应角色分配"游戏管理"菜单的访问权限
3. 通过菜单访问游戏管理模块

## 注意事项

1. 删除操作不可恢复，请谨慎操作
2. 货币调整功能需要记录调整原因，便于后续审计
3. 英雄数据导入需要提供有效的JSON格式数据
