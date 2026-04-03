import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import PlayerIndex from '../player/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getPlayerList: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      players: [
        {
          accountId: 1,
          nickname: '测试玩家',
          level: 10,
          experience: 1000,
          gold: 5000,
          diamonds: 100,
          createdAt: '2024-01-01',
          lastLoginAt: '2024-01-02'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createPlayer: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updatePlayer: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deletePlayer: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('PlayerIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(PlayerIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders player management title', () => {
    expect(wrapper.text()).toContain('玩家管理')
  })

  it('renders search form', () => {
    expect(wrapper.text()).toContain('账号ID')
    expect(wrapper.text()).toContain('开始时间')
    expect(wrapper.text()).toContain('结束时间')
  })

  it('opens create dialog when create button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建') || btn.text().includes('创'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('创建玩家')
  })

  it('calls createPlayer API when creating', async () => {
    const { createPlayer } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreate()
    wrapper.vm.form.accountId = 123
    wrapper.vm.form.nickname = '新玩家'
    wrapper.vm.form.level = 1
    wrapper.vm.form.gold = 0
    wrapper.vm.form.diamonds = 0
    
    await wrapper.vm.handleSubmit()
    
    expect(createPlayer).toHaveBeenCalled()
  })

  it('calls updatePlayer API when editing', async () => {
    const { updatePlayer } = await import('@/api/proxy-api')
    
    // 直接设置 form 数据来模拟编辑 - 使用 form.id 而不是 form.accountId
    wrapper.vm.form.id = 1
    wrapper.vm.form.accountId = 1
    wrapper.vm.form.nickname = '更新后的玩家'
    
    await wrapper.vm.handleSubmit()
    
    expect(updatePlayer).toHaveBeenCalled()
  })

  it('calls deletePlayer API when deleting', async () => {
    const { deletePlayer } = await import('@/api/proxy-api')
    
    await wrapper.vm.handleDelete(1)
    
    expect(deletePlayer).toHaveBeenCalled()
  })

  it('loads player list on mount', async () => {
    const { getPlayerList } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getPlayerList).toHaveBeenCalled()
  })
})
