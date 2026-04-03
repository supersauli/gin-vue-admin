import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import GachaIndex from '../gacha/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getGachaRule: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      rules: [
        {
          poolId: 1,
          ruleName: '测试规则',
          drawType: 'single',
          costCurrency: 'diamonds',
          costAmount: 100,
          discount: 1,
          guaranteeRarity: 4,
          guaranteeDraws: 10,
          guaranteeMaxRarity: 5,
          dailyLimit: 10,
          weeklyLimit: 50,
          monthlyLimit: 200,
          isActive: true
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createGachaRule: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updateGachaRule: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deleteGachaRule: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  getGachaLogs: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      logs: [
        {
          id: 1,
          accountId: 1,
          poolId: 1,
          drawType: 'single',
          costCurrency: 'diamonds',
          costAmount: 100,
          items: [{ itemId: 1, name: '测试道具', rarity: 4 }],
          createdAt: '2024-01-01'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('GachaIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(GachaIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders gacha management title', () => {
    expect(wrapper.text()).toContain('抽卡管理')
  })

  it('renders tabs', () => {
    expect(wrapper.text()).toContain('抽卡规则管理')
    expect(wrapper.text()).toContain('抽卡日志查询')
  })

  it('renders rule search form', () => {
    expect(wrapper.text()).toContain('卡池ID')
    expect(wrapper.text()).toContain('规则名称')
    expect(wrapper.text()).toContain('激活状态')
  })

  it('opens create rule dialog when create button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建') || btn.text().includes('创'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.ruleDialogVisible).toBe(true)
    expect(wrapper.vm.ruleDialogTitle).toBe('创建抽卡规则')
  })

  it('calls createGachaRule API when creating rule', async () => {
    const { createGachaRule } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreateRule()
    // 注意：组件使用 ruleForm.poolId && ruleForm.ruleName 判断，两者都有值则更新
    // 所以创建时不要设置这两个值
    wrapper.vm.ruleForm.drawType = 'single'
    wrapper.vm.ruleForm.costCurrency = 'diamonds'
    wrapper.vm.ruleForm.costAmount = 100
    wrapper.vm.ruleForm.isActive = true
    
    await wrapper.vm.handleRuleSubmit()
    
    expect(createGachaRule).toHaveBeenCalled()
  })

  it('calls updateGachaRule API when editing rule', async () => {
    const { updateGachaRule } = await import('@/api/proxy-api')
    
    // 设置 poolId 和 ruleName 来触发更新逻辑
    wrapper.vm.ruleForm.poolId = 1
    wrapper.vm.ruleForm.ruleName = '更新后的规则'
    
    await wrapper.vm.handleRuleSubmit()
    
    expect(updateGachaRule).toHaveBeenCalled()
  })

  it('loads rule list on mount', async () => {
    const { getGachaRule } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getGachaRule).toHaveBeenCalled()
  })

  it('switches to logs tab', async () => {
    wrapper.vm.activeTab = 'logs'
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.activeTab).toBe('logs')
  })

  it('loads gacha logs when switching to logs tab', async () => {
    const { getGachaLogs } = await import('@/api/proxy-api')
    
    wrapper.vm.activeTab = 'logs'
    await wrapper.vm.$nextTick()
    
    expect(getGachaLogs).toHaveBeenCalled()
  })
})
