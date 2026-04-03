import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import UserIndex from '../user/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getUserList: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      users: [
        {
          accountId: 1,
          openId: 'test_openid',
          unionId: 'test_unionid',
          nickname: '测试用户',
          avatarUrl: 'test.png',
          gender: 1,
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
  createUser: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  updateUser: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  deleteUser: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('UserIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(UserIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders user management title', () => {
    expect(wrapper.text()).toContain('用户管理')
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
    expect(wrapper.vm.dialogTitle).toBe('创建用户')
  })

  it('calls createUser API when creating', async () => {
    const { createUser } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreate()
    wrapper.vm.form.openId = 'new_openid'
    wrapper.vm.form.nickname = '新用户'
    wrapper.vm.form.gender = 1
    
    await wrapper.vm.handleSubmit()
    
    expect(createUser).toHaveBeenCalled()
  })

  it('calls updateUser API when editing', async () => {
    const { updateUser } = await import('@/api/proxy-api')
    
    wrapper.vm.isEdit = true
    wrapper.vm.form.accountId = 1
    wrapper.vm.form.nickname = '更新后的用户'
    
    await wrapper.vm.handleSubmit()
    
    expect(updateUser).toHaveBeenCalled()
  })

  it('calls deleteUser API when deleting', async () => {
    const { deleteUser } = await import('@/api/proxy-api')
    
    await wrapper.vm.handleDelete(1)
    
    expect(deleteUser).toHaveBeenCalled()
  })

  it('loads user list on mount', async () => {
    const { getUserList } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getUserList).toHaveBeenCalled()
  })
})
