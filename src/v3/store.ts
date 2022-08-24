import { FieldMeta, Path, Store, SubscribeCallback } from './type'
import { getNamePath, getValue, setValue } from './utils'

export class FormStore {
  private store: Store = {}
  private observers: SubscribeCallback[] = []

  constructor(initialValues?: Store) {
    initialValues && this.updateStore(initialValues)
  }

  private updateStore(nextStore: Store) {
    this.store = nextStore
  }

  private notify(changedFiles: FieldMeta[], external?: boolean) {
    this.observers.forEach((callback) => {
      callback(changedFiles, external)
    })
  }

  subscribe(callback: SubscribeCallback) {
    this.observers.push(callback)

    return () => {
      this.observers = this.observers.filter((fn) => fn !== callback)
    }
  }

  getFields(paths?: Path[]): any[] {
    if (!paths) {
      return [this.store]
    }
    return paths.map((path) => {
      return getValue(this.store, getNamePath(path))
    })
  }

  setFields(fields: FieldMeta[], external?: boolean) {
    fields.forEach((field) => {
      this.updateStore(
        setValue(this.store, getNamePath(field.name), field.value)
      )
    })
    this.notify(fields, external)
  }
}
