# 前端测试使用指南

## 单元测试（Vitest）

### 运行命令

```bash
# 监听模式（开发时使用）
npm run test

# 单次运行
npm run test:run
```

### 测试文件位置

```
web/src/view/admin/__tests__/
├── pool.test.js      # 卡池管理
├── item.test.js      # 道具管理
├── npc.test.js       # NPC管理
├── hero.test.js      # 英雄管理
├── player.test.js    # 玩家管理
├── user.test.js      # 用户管理
├── wallet.test.js    # 钱包管理
├── gacha.test.js     # 抽卡管理
└── admin.test.js     # 管理页面容器
```

### 特点

- 使用 `vi.mock()` 模拟 API 调用
- 不发送真实请求到后端
- 测试组件逻辑和交互
- 速度快，适合开发时频繁运行

---

## E2E 测试（Playwright）

### 安装系统依赖（首次）

```bash
# Ubuntu/Debian
sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 libcairo2 libasound2

# 或者使用 playwright 自动安装
sudo npx playwright install-deps chromium
```

### 运行命令

```bash
# 运行测试（headless 模式，推荐服务器使用）
npm run test:e2e

# 带 UI 模式运行（需要图形界面或 xvfb）
npm run test:e2e:ui
```

### 无图形界面服务器

如果服务器没有图形界面，使用以下方式：

```bash
# 方式1：使用 headless 模式（推荐）
npm run test:e2e

# 方式2：安装 xvfb 后使用 UI 模式
sudo apt-get install -y xvfb
npm run test:e2e:ui
```

### 测试文件位置

```
web/e2e/
├── pool.spec.js      # 卡池管理 E2E 测试
├── hero.spec.js      # 英雄管理 E2E 测试
├── item.spec.js      # 道具管理 E2E 测试
├── npc.spec.js       # NPC管理 E2E 测试
├── player.spec.js    # 玩家管理 E2E 测试
├── user.spec.js      # 用户管理 E2E 测试
└── wallet.spec.js    # 钱包管理 E2E 测试
```

### 特点

- 启动真实浏览器
- 发送真实 API 请求到后端
- 模拟用户真实操作
- 适合测试完整业务流程

### 前置条件

- 前端开发服务器已启动（`npm run dev`）
- 后端服务已启动
- 数据库已连接

---

## 配置文件

| 文件 | 说明 |
|------|------|
| `vitest.config.js` | Vitest 配置 |
| `playwright.config.js` | Playwright 配置 |

---

## 常见问题

### 1. Playwright 启动失败：缺少共享库

```bash
sudo npx playwright install-deps chromium
```

### 2. Vitest 测试找不到模块

检查 `vitest.config.js` 中的 alias 配置是否正确。

### 3. E2E 测试超时

确保前端服务器已启动，检查 `playwright.config.js` 中的 `baseURL` 和 `webServer.url` 配置。

### 4. E2E 测试登录失败（验证码问题）

系统有图片验证码，E2E 测试需要处理验证码。推荐方案：

**方案1：后端禁用验证码（测试环境）**

在后端配置中将验证码开关设为 0：

```yaml
# config.yaml
captcha:
  open-captcha: 0
```

**方案2：使用 API 直接登录获取 Token**

```javascript
// 在测试中通过 API 获取 token
const response = await fetch('http://localhost:8888/api/base/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: '123456',
    captcha: 'xxx',
    captchaId: 'xxx'
  })
})
const { data } = await response.json()
// 将 token 设置到 localStorage
await page.evaluate((token) => {
  localStorage.setItem('token', token)
}, data.token)
```

**方案3：使用 Playwright 的 storageState**

在首次登录后保存认证状态，后续测试直接复用：

```javascript
// global-setup.js
async function globalSetup() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  // 登录逻辑...
  await page.context().storageState({ path: './auth.json' })
  await browser.close()
}

// playwright.config.js
use: {
  storageState: './auth.json',
}
```

---

## 添加新测试

### 单元测试

在 `web/src/view/admin/__tests__/` 目录下创建 `xxx.test.js` 文件：

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import YourComponent from '../your-component/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  yourApi: vi.fn(() => Promise.resolve({ code: 0, data: {}, message: 'ok' }))
}))

describe('YourComponent', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(YourComponent, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders correctly', () => {
    expect(wrapper.text()).toContain('Your Title')
  })
})
```

### E2E 测试

在 `web/e2e/` 目录下创建 `xxx.spec.js` 文件：

```javascript
import { test, expect } from '@playwright/test'

test.describe('Your Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page')
    await page.waitForLoadState('networkidle')
  })

  test('page title is correct', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Your Title')
  })

  test('click button works', async ({ page }) => {
    const button = page.locator('button:has-text("Your Button")')
    await button.click()
    await expect(page.locator('.el-message--success')).toBeVisible()
  })
})
```
