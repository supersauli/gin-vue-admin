import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus from 'element-plus'
import WalletIndex from '../wallet/index.vue'

// Mock API
vi.mock('@/api/proxy-api', () => ({
  getCurrencyList: vi.fn(() => Promise.resolve({
    code: 0,
    data: {
      wallets: [
        {
          accountId: 1,
          currency: 'gold',
          balance: 1000,
          updatedAt: '2024-01-01'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10
    },
    message: 'ok'
  })),
  createUserWallet: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' })),
  adjustCurrency: vi.fn(() => Promise.resolve({ code: 0, message: 'ok' }))
}))

// Mock dictionary
vi.mock('@/utils/dictionary', () => ({
  getDict: vi.fn(() => Promise.resolve([{ label: '游戏1', value: 'game1' }]))
}))

describe('WalletIndex', () => {
  let wrapper

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(WalletIndex, {
      global: {
        plugins: [ElementPlus]
      }
    })
  })

  it('renders wallet management title', () => {
    expect(wrapper.text()).toContain('钱包管理')
  })

  it('renders search form', () => {
    expect(wrapper.text()).toContain('账号ID')
    expect(wrapper.text()).toContain('货币类型')
    expect(wrapper.text()).toContain('余额最小值')
  })

  it('opens create wallet dialog when create button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const createButton = buttons.find(btn => btn.text().includes('创建钱包') || btn.text().includes('创建'))
    expect(createButton.exists()).toBe(true)
    await createButton.trigger('click')
    expect(wrapper.vm.createDialogVisible).toBe(true)
  })

  it('opens adjust currency dialog when adjust button is clicked', async () => {
    const buttons = wrapper.findAll('button')
    const adjustButton = buttons.find(btn => btn.text().includes('调整货币') || btn.text().includes('调整'))
    expect(adjustButton.exists()).toBe(true)
    await adjustButton.trigger('click')
    expect(wrapper.vm.adjustDialogVisible).toBe(true)
  })

  it('calls createUserWallet API when creating wallet', async () => {
    const { createUserWallet } = await import('@/api/proxy-api')
    
    wrapper.vm.handleCreateWallet()
    wrapper.vm.createForm.accountId = 123
    wrapper.vm.createForm.currency = 'gold'
    wrapper.vm.createForm.balance = 0
    
    await wrapper.vm.handleCreateWalletSubmit()
    
    expect(createUserWallet).toHaveBeenCalled()
  })

  it('calls adjustCurrency API when adjusting currency', async () => {
    const { adjustCurrency } = await import('@/api/proxy-api')
    
    wrapper.vm.handleAdjustCurrency()
    wrapper.vm.adjustForm.accountId = 123
    wrapper.vm.adjustForm.currency = 'gold'
    wrapper.vm.adjustForm.amount = 100
    wrapper.vm.adjustForm.type = 'add'
    
    await wrapper.vm.handleAdjustCurrencySubmit()
    
    expect(adjustCurrency).toHaveBeenCalled()
  })

  it('loads wallet list on mount', async () => {
    const { getCurrencyList } = await import('@/api/proxy-api')
    
    await wrapper.vm.$nextTick()
    
    expect(getCurrencyList).toHaveBeenCalled()
  })
})
