# 菜单更新SQL流程指南

## 问题分析

在执行菜单SQL语句时，可能会遇到以下问题：

1. **表名错误**：数据库中的表名是 `sys_base_menus`（复数形式），而不是 `sys_base_menu`（单数形式）
2. **列名错误**：数据库表中没有 `meta` 列，而是将 `meta` 字段拆分成了多个单独的列，如 `title`、`icon`、`keep_alive` 等
3. **语法错误**：PostgreSQL 使用不同的语法来处理变量，需要使用 `DO $$` 块

## 解决方案

### 步骤1：准备SQL文件

创建或更新 `server/resource/sql/menu.sql` 文件，使用正确的表名和列名：

```sql
-- 菜单初始化SQL语句
-- 执行此SQL语句可以手动将菜单插入到数据库中

-- 先删除现有的gameAdmin菜单及其子菜单，避免重复
DELETE FROM sys_base_menus WHERE name = 'gameAdmin';
DELETE FROM sys_base_menus WHERE parent_id IN (SELECT id FROM sys_base_menus WHERE name = 'gameAdmin');

-- 插入gameAdmin父菜单
INSERT INTO sys_base_menus (menu_level, hidden, parent_id, path, name, component, sort, title, icon, keep_alive, default_menu, close_tab, transition_type)
VALUES (0, false, 0, 'gameAdmin', 'gameAdmin', 'view/admin/index.vue', 2, '游戏管理', 'computer', false, false, false, '');

-- 获取gameAdmin菜单的ID
DO $$
DECLARE
    game_admin_id INTEGER;
BEGIN
    SELECT id INTO game_admin_id FROM sys_base_menus WHERE name = 'gameAdmin';
    
    -- 插入gameAdmin子菜单
    INSERT INTO sys_base_menus (menu_level, hidden, parent_id, path, name, component, sort, title, icon, keep_alive, default_menu, close_tab, transition_type)
    VALUES
    (1, false, game_admin_id, 'player', 'player', 'view/admin/player/index.vue', 1, '玩家管理', 'user', false, false, false, ''),
    (1, false, game_admin_id, 'user', 'gameUser', 'view/admin/user/index.vue', 2, '用户管理', 'people', false, false, false, ''),
    (1, false, game_admin_id, 'wallet', 'wallet', 'view/admin/wallet/index.vue', 3, '钱包管理', 'wallet', false, false, false, ''),
    (1, false, game_admin_id, 'hero', 'hero', 'view/admin/hero/index.vue', 4, '英雄管理', 'star', false, false, false, ''),
    (1, false, game_admin_id, 'pool', 'pool', 'view/admin/pool/index.vue', 5, '池管理', 'collection', false, false, false, ''),
    (1, false, game_admin_id, 'item', 'item', 'view/admin/item/index.vue', 6, '物品管理', 'goods', false, false, false, ''),
    (1, false, game_admin_id, 'npc', 'npc', 'view/admin/npc/index.vue', 7, 'NPC管理', 'tickets', false, false, false, ''),
    (1, false, game_admin_id, 'gacha', 'gacha', 'view/admin/gacha/index.vue', 8, '抽奖管理', 'lottery', false, false, false, '');
END $$;

-- 查看插入结果
SELECT * FROM sys_base_menus WHERE parent_id IN (SELECT id FROM sys_base_menus WHERE name = 'gameAdmin') OR name = 'gameAdmin';
```

### 步骤2：复制SQL文件到Docker容器

使用 `docker cp` 命令将SQL文件复制到PostgreSQL容器内：

```bash
docker cp server/resource/sql/menu.sql 2cd11b7ec085_gva-pgsql:/tmp/menu.sql
```

### 步骤3：执行SQL文件

使用 `docker exec` 命令在PostgreSQL容器内执行SQL文件：

```bash
docker exec -it 2cd11b7ec085_gva-pgsql psql -U gva -d qmPlus -f /tmp/menu.sql
```

### 步骤4：验证菜单是否添加成功

执行以下命令验证菜单是否添加成功：

```bash
docker exec -it 2cd11b7ec085_gva-pgsql psql -U gva -d qmPlus -c "SELECT * FROM sys_base_menus WHERE parent_id IN (SELECT id FROM sys_base_menus WHERE name = 'gameAdmin') OR name = 'gameAdmin'"
```

## 注意事项

1. **容器名称**：请根据实际运行的容器名称修改命令中的容器ID（如 `2cd11b7ec085_gva-pgsql`）
2. **数据库连接信息**：确保使用正确的数据库用户名（`gva`）和数据库名称（`qmPlus`）
3. **SQL语法**：PostgreSQL 使用 `DO $$` 块来处理变量，这与MySQL的语法不同
4. **列名**：确保使用正确的列名，特别是将 `meta` 字段拆分成的多个单独列

## 故障排除

如果执行过程中遇到错误，请检查以下几点：

1. 容器是否正在运行：`docker ps`
2. 数据库连接信息是否正确
3. SQL语法是否正确
4. 表名和列名是否与数据库中的实际结构匹配

## 替代方法

如果上述方法仍然无法正常工作，您可以尝试通过系统初始化来添加菜单：

1. 确保 `server/source/system/menu.go` 文件中已经添加了游戏管理菜单的定义
2. 重启服务器容器：`docker-compose restart server`
3. 系统会在启动时自动执行菜单初始化

这样，您就可以成功在Docker环境中添加游戏管理菜单了。