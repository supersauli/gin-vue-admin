import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import ItemIndex from '../item/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getItemList: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      items: [
        {
          itemId: 1,
          name: '测试道具',
          type: '武器',
          subType: '剑',
          desc: '测试描述',
          iconUrl: 'test.png',
          rarity: 1,
          maxStack: 99,
          useLevel: 1,
          price: 100,
          isSellable: true,
          isConsume: false
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createItem: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updateItem: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deleteItem: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('ItemIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(ItemIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders item management title', () => {
    expect(wrapper.text()).toContain('道具管理')
  })

  it('renders search form', () => {
    expect(wrapper.text()).toContain('道具ID')
    expect(wrapper.text()).toContain('道具名称')
    expect(wrapper.text()).toContain('道具类型')
  })

  it('opens create dialog when create button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建') || btn.text().includes('创'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('创建道具')
  })

  it('sets isEdit to false when creating', async () => {
    wrapper.vm.handleCreate()
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('calls createItem API when creating', async () => {
    const { createItem } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreate()
    wrapper.vm.form.name = '新道具'
    wrapper.vm.form.type = '武器'
    wrapper.vm.form.desc = '新描述'
    wrapper.vm.form.rarity = 1
    
    await wrapper.vm.handleSubmit()
    
    expect(createItem).toHaveBeenCalled()
  })

  it('calls updateItem API when editing', async () => {
    const { updateItem } = await import('@/api/proxy-api')
    
    wrapper.vm.isEdit = true
    wrapper.vm.form.itemId = 1
    wrapper.vm.form.name = '更新后的道具'
    
    await wrapper.vm.handleSubmit()
    
    expect(updateItem).toHaveBeenCalled()
  })

  it('calls deleteItem API when deleting', async () => {
    const { deleteItem } = await import('@/api/proxy-api')
    
    await wrapper.vm.handleDelete(1)
    
    expect(deleteItem).toHaveBeenCalled()
  })

  it('loads item list on mount', async () => {
    const { getItemList } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getItemList).toHaveBeenCalled()
  })
})
