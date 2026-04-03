import { test, expect } from '@playwright/test'

async function loginAndNavigate(page, menuText) {
  await page.goto('/#/login')
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(1000)
  await page.locator('input[placeholder="请输入用户名"]').fill('admin')
  await page.locator('input[placeholder="请输入密码"]').fill('123456')
  await page.locator('button:has-text("登")').click()
  await page.waitForURL('**/#/layout/**', { timeout: 10000 })
  await page.waitForTimeout(2000)
  
  const collapseBtn = page.locator('.hamburger, .el-icon--fold, .el-icon--expand, [class*="collapse"]')
  if (await collapseBtn.isVisible().catch(() => false)) {
    await collapseBtn.click()
    await page.waitForTimeout(500)
  }
  
  await page.evaluate((text) => {
    const menuItems = document.querySelectorAll('.el-menu-item')
    for (const item of menuItems) {
      if (item.textContent.includes(text)) {
        item.click()
        return true
      }
    }
    return false
  }, menuText)
  
  await page.waitForTimeout(3000)
  await page.waitForLoadState('networkidle')
}

test.describe('玩家管理', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndNavigate(page, '玩家管理')
  })

  test('页面标题正确', async ({ page }) => {
    await expect(page.locator('h2').filter({ hasText: '玩家管理' })).toBeVisible()
  })

  test('显示创建按钮', async ({ page }) => {
    await expect(page.locator('button:has-text("创")')).toBeVisible()
  })

  test('创建玩家流程', async ({ page }) => {
    await page.route('**/admin/players/create', async route => {
      const data = JSON.parse(route.request().postData() || '{}')
      await route.continue({ postData: JSON.stringify(data) })
    })
    
    await page.locator('button:has-text("创")').click()
    await expect(page.locator('.el-dialog__title')).toContainText('创建玩家')
    
    const timestamp = Date.now()
    await page.locator('.el-dialog input[placeholder="请输入账号ID"]').fill(String(timestamp))
    await page.locator('.el-dialog textarea[placeholder="请输入玩家数据"]').fill('{}')
    
    await page.locator('.el-dialog__footer button:has-text("确定")').click()
    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10000 })
    await page.waitForTimeout(2000)
    await expect(page.locator(`text=${timestamp}`).first()).toBeVisible({ timeout: 10000 })
  })
})
