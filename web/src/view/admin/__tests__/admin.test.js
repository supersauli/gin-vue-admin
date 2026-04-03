import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import AdminIndex from '../index.vue'

// Mock router store
vi.mock('@/pinia/modules/router', () => ({
  useRouterStore: vi.fn(() => ({
    keepAliveRouters: []
  }))
}))

describe('AdminIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(AdminIndex, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          'router-view': true,
          'transition': true,
          'keep-alive': true
        }
      }
    })
  })

  it('renders admin container', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('has Admin component name', () => {
    expect(wrapper.vm.$options.name).toBe('Admin')
  })

  it('contains router-view', () => {
    const routerView = wrapper.findComponent({ name: 'router-view' })
    expect(routerView.exists()).toBe(true)
  })
})
