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