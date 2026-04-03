import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import NpcIndex from '../npc/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getNPCList: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      npcs: [
        {
          npcId: 1,
          name: '测试NPC',
          type: '商人',
          subType: '武器商',
          level: 10,
          desc: '测试描述',
          iconUrl: 'test.png',
          model: 'npc_model',
          attributes: { hp: 100, mp: 50 },
          skills: ['skill1', 'skill2'],
          isActive: true
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createNPC: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updateNPC: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deleteNPC: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('NpcIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(NpcIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders NPC management title', () => {
    expect(wrapper.text()).toContain('NPC管理')
  })

  it('renders search form', () => {
    expect(wrapper.text()).toContain('NPC ID')
    expect(wrapper.text()).toContain('NPC名称')
    expect(wrapper.text()).toContain('NPC类型')
  })

  it('opens create dialog when create button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建') || btn.text().includes('创'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.dialogVisible).toBe(true)
    expect(wrapper.vm.dialogTitle).toBe('创建NPC')
  })

  it('sets isEdit to false when creating', async () => {
    wrapper.vm.handleCreate()
    expect(wrapper.vm.isEdit).toBe(false)
  })

  it('calls createNPC API when creating', async () => {
    const { createNPC } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreate()
    wrapper.vm.form.name = '新NPC'
    wrapper.vm.form.type = '商人'
    wrapper.vm.form.desc = '新描述'
    wrapper.vm.form.level = 10
    
    await wrapper.vm.handleSubmit()
    
    expect(createNPC).toHaveBeenCalled()
  })

  it('calls updateNPC API when editing', async () => {
    const { updateNPC } = await import('@/api/proxy-api')
    
    wrapper.vm.isEdit = true
    wrapper.vm.form.npcId = 1
    wrapper.vm.form.name = '更新后的NPC'
    
    await wrapper.vm.handleSubmit()
    
    expect(updateNPC).toHaveBeenCalled()
  })

  it('calls deleteNPC API when deleting', async () => {
    const { deleteNPC } = await import('@/api/proxy-api')
    
    await wrapper.vm.handleDelete(1)
    
    expect(deleteNPC).toHaveBeenCalled()
  })

  it('loads NPC list on mount', async () => {
    const { getNPCList } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getNPCList).toHaveBeenCalled()
  })
})
