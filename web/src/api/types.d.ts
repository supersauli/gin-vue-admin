// API 客户端类型定义

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  params?: Record<string, any>
  data?: any
  headers?: Record<string, string>
}

export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface ProxyParams {
  proxy: string
}

// 英雄相关API类型
export interface HeroApiMethods {
  get(url: string, params?: Record<string, any>): Promise<ApiResponse>
  post(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  put(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  delete(url: string, params?: Record<string, any>): Promise<ApiResponse>
}

// 道具相关API类型
export interface ItemApiMethods {
  get(url: string, params?: Record<string, any>): Promise<ApiResponse>
  post(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  put(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  delete(url: string, params?: Record<string, any>): Promise<ApiResponse>
}

// NPC相关API类型
export interface NpcApiMethods {
  get(url: string, params?: Record<string, any>): Promise<ApiResponse>
  post(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  put(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  delete(url: string, params?: Record<string, any>): Promise<ApiResponse>
}

// 用户相关API类型
export interface UserApiMethods {
  get(url: string, params?: Record<string, any>): Promise<ApiResponse>
  post(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  put(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  delete(url: string, params?: Record<string, any>): Promise<ApiResponse>
}

// 管理员相关API类型
export interface AdminApiMethods {
  get(url: string, params?: Record<string, any>): Promise<ApiResponse>
  post(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  put(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  delete(url: string, params?: Record<string, any>): Promise<ApiResponse>
}

// 英雄数据模型
export interface HeroData {
  id: number
  name: string
  level: number
  exp: number
  power: number
  status: 'equipped' | 'unequipped'
}

// 英雄创建请求
export interface HeroCreateRequest {
  heroId: number
  name: string
  rarity: number
  iconUrl: string
  imageUrl: string
  isActive: boolean
  weight: number
  attributes: string
}

// 英雄更新请求
export interface HeroUpdateRequest {
  heroId: number
  name: string
  rarity: number
  iconUrl: string
  imageUrl: string
  isActive: boolean
  weight: number
  attributes: string
}

// 道具数据模型
export interface ItemData {
  id: number
  name: string
  type: string
  quantity: number
  description: string
}

// NPC数据模型
export interface NpcData {
  id: number
  name: string
  type: string
  position: { x: number; y: number }
  dialogue: string[]
}

// 用户信息数据模型
export interface UserInfo {
  uuid: string
  username: string
  nickname: string
  email: string
  avatar: string
  level: number
  experience: number
}

// 玩家数据模型
export interface PlayerData {
  id: number
  uuid: string
  username: string
  nickname: string
  level: number
  created_at: string
  last_login: string
}

// 管理员操作数据模型
export interface AdminOperationData {
  operation_id: string
  operator_uuid: string
  target_type: 'player' | 'user' | 'hero' | 'item' | 'npc'
  target_id: number
  operation: string
  old_value: any
  new_value: any
  timestamp: string
  success: boolean
}

// API客户端类类型
export class ApiClient implements HeroApiMethods, ItemApiMethods, NpcApiMethods, UserApiMethods, AdminApiMethods {
  constructor(baseUrl?: string)

  createConfig(method: string, url: string, params?: Record<string, any>, data?: any): ApiRequestConfig

  get(url: string, params?: Record<string, any>): Promise<ApiResponse>
  post(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  put(url: string, params?: Record<string, any>, data?: any): Promise<ApiResponse>
  delete(url: string, params?: Record<string, any>): Promise<ApiResponse>
}

// 导出所有API客户端
export const heroApi: HeroApiMethods
export const itemApi: ItemApiMethods
export const npcApi: NpcApiMethods
export const userApi: UserApiMethods
export const adminApi: AdminApiMethods