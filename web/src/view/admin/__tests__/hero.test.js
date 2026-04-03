import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import HeroIndex from '../hero/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getHeroList: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      heroes: [
        {
          heroId: 1,
          name: '测试英雄',
          desc: '测试描述',
          iconUrl: 'test.png',
          rarity: 1,
          isActive: true,
          attributes: { hp: 100, mp: 50, attack: 10, defense: 5 },
          skills: ['skill1', 'skill2']
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createHero: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updateHero: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deleteHero: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  importHeroes: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  exportHero: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('HeroIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(HeroIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders hero management title', () => {
    expect(wrapper.text()).toContain('英雄管理')
  })

  it('renders import and export buttons', () => {
    expect(wrapper.text()).toContain('导入')
    expect(wrapper.text()).toContain('导出')
  })

  it('renders search form', () => {
    expect(wrapper.text()).toContain('英雄ID')
    expect(wrapper.text()).toContain('英雄名称')
    expect(wrapper.text()).toContain('稀有度')
  })

  it('opens create dialog when create button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('创建英雄')
  })

  it('sets isEdit to false when creating', async () => {
    wrapper.vm.handleCreate()
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('calls createHero API when creating', async () => {
    const { createHero } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreate()
    wrapper.vm.form.name = '新英雄'
    wrapper.vm.form.desc = '新描述'
    wrapper.vm.form.rarity = 1
    wrapper.vm.form.isActive = true
    
    await wrapper.vm.handleSubmit()
    
    expect(createHero).toHaveBeenCalled()
  })

  it('calls updateHero API when editing', async () => {
    const { updateHero } = await import('@/api/proxy-api')
    
    wrapper.vm.isEdit = true
    wrapper.vm.form.heroId = 1
    wrapper.vm.form.name = '更新后的英雄'
    
    await wrapper.vm.handleSubmit()
    
    expect(updateHero).toHaveBeenCalled()
  })

  it('calls deleteHero API when deleting', async () => {
    const { deleteHero } = await import('@/api/proxy-api')
    
    await wrapper.vm.handleDelete(1)
    
    expect(deleteHero).toHaveBeenCalled()
  })

  it('loads hero list on mount', async () => {
    const { getHeroList } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getHeroList).toHaveBeenCalled()
  })
})
