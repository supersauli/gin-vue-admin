import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import PoolIndex from '../pool/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  queryPool: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      pools: [
        {
          poolId: 1,
          name: '测试卡池',
          description: '测试描述',
          costType: '金币',
          costAmount: '100',
          isActive: true,
          startTime: '1775110506',
          endTime: '1775110507',
          probability: { rarity1: '0', rarity2: '0', rarity3: '0', rarity4: '0' }
        }
      ],
      total: '1',
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createPool: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updatePool: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deletePool: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('PoolIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(PoolIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders pool management title', () => {
    expect(wrapper.text()).toContain('卡池管理')
  })

  it('renders search form', () => {
    expect(wrapper.text()).toContain('卡池ID')
    expect(wrapper.text()).toContain('卡池名称')
    expect(wrapper.text()).toContain('激活状态')
  })

  it('opens create dialog when create button is clicked', async () => {
    // 使用更可靠的方式查找按钮
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建') || btn.text().includes('创'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('创建卡池')
  })

  it('sets isEdit to false when creating', async () => {
    wrapper.vm.handleCreate()
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('calls createPool API when creating', async () => {
    const { createPool } = await import('@/api/proxy-api')
    
    // 直接调用方法
    wrapper.vm.handleCreate()
    wrapper.vm.form.name = '新卡池'
    wrapper.vm.form.description = '新描述'
    wrapper.vm.form.costCurrency = '金币'
    wrapper.vm.form.costAmount = 100
    wrapper.vm.form.isActive = true
    
    await wrapper.vm.handleSubmit()
    
    expect(createPool).toHaveBeenCalled()
  })

  it('calls updatePool API when editing', async () => {
    const { updatePool } = await import('@/api/proxy-api')
    
    wrapper.vm.isEdit = true
    wrapper.vm.form.poolId = 1
    wrapper.vm.form.name = '更新后的卡池'
    
    await wrapper.vm.handleSubmit()
    
    expect(updatePool).toHaveBeenCalled()
  })

  it('calls deletePool API when deleting', async () => {
    const { deletePool } = await import('@/api/proxy-api')
    
    await wrapper.vm.handleDelete(1)
    
    expect(deletePool).toHaveBeenCalled()
  })

  it('loads pool list on mount', async () => {
    const { queryPool } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(queryPool).toHaveBeenCalled()
  })
})
