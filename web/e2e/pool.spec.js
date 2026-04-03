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

test.describe('卡池管理', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndNavigate(page, '池管理')
  })

  test('页面标题正确', async ({ page }) => {
    const mainContent = page.locator('.gva-container, .gva-layout, main, .el-main')
    await expect(mainContent.locator('h2').first()).toContainText('卡池管理')
  })

  test('显示创建按钮', async ({ page }) => {
    await expect(page.locator('button:has-text("创")')).toBeVisible()
  })

  test('创建卡池流程', async ({ page }) => {
    // 拦截创建请求，添加 startTime 和 endTime
    await page.route('**/admin/pool/create', async route => {
      const postData = JSON.parse(route.request().postData() || '{}')
      const now = Math.floor(Date.now() / 1000)
      const futureTime = now + 86400 * 30
      
      // 添加缺失的时间字段
      if (!postData.startTime) postData.startTime = String(now)
      if (!postData.endTime) postData.endTime = String(futureTime)
      
      await route.continue({
        postData: JSON.stringify(postData)
      })
    })
    
    await page.locator('button:has-text("创")').click()
    await expect(page.locator('.el-dialog__title')).toContainText('创建卡池')
    
    const timestamp = Date.now()
    await page.locator('.el-dialog input[placeholder="请输入卡池ID"]').fill(String(timestamp))
    await page.locator('.el-dialog input[placeholder="请输入卡池名称"]').fill(`E2E卡池-${timestamp}`)
    await page.locator('.el-dialog textarea[placeholder="请输入卡池描述"]').fill('E2E自动化测试创建')
    await page.locator('.el-dialog input[placeholder="请输入消耗货币类型"]').fill('金币')
    await page.locator('.el-dialog input[placeholder="请输入单次消耗"]').fill('100')
    
    await page.locator('.el-dialog__footer button:has-text("确定")').click()
    await expect(page.locator('.el-message--success')).toBeVisible({ timeout: 10000 })
  })
})
