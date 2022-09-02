import { FieldMeta, Store, SubscribeCallback } from './type'

export class FormStore {
  // 保存所有表单项的值
  private store: Store = {}
  // 监听器数组
  private observers: SubscribeCallback[] = []

  constructor(initialValues?: Store) {
    initialValues && this.updateStore(initialValues)
  }

  private updateStore(nextStore: Store) {
    this.store = nextStore
  }
  // 当有值改变时，给所有监听器发布通知
  private notify(changedFiles: FieldMeta[]) {
    this.observers.forEach((callback) => {
      callback(changedFiles)
    })
  }
  // 注册监听器
  subscribe(callback: SubscribeCallback) {
    this.observers.push(callback)
    return () => {
      this.observers = this.observers.filter((fn) => fn !== callback)
    }
  }
  getFields(names?: string[]): any[] {
    if (!names) {
      return [this.store]
    }
    return names.map((name) => {
      return this.store[name]
    })
  }

  setFields(fields: FieldMeta[]) {
    const newStore = {
      ...this.store,
      ...fields.reduce((acc, next) => {
        acc[next.name] = next.value
        return acc
      }, {} as Store),
    }
    this.updateStore(newStore)
    // 当 store 更新时发送通知
    this.notify(fields)
  }
}
