import { FieldMeta, Path, Store, WatchCallback, FiledCallback } from './type'
import { getNamePath, getValue, setValue } from './utils'

export class FormStore {
  private store: Store = {}
  private watchList: WatchCallback[] = []
  private fieldList: FiledCallback[] = []

  constructor(initialValues?: Store) {
    initialValues && this.updateStore(initialValues)
  }

  private updateStore(nextStore: Store) {
    this.store = nextStore
  }

  private notifyFieldList(changedFiles: FieldMeta[], external?: boolean) {
    this.fieldList.forEach((callback) => {
      callback(changedFiles, external)
    })
  }
  private notifyWatchList(changedFiles: FieldMeta[], external?: boolean) {
    this.watchList.forEach((callback) => {
      callback(changedFiles, external)
    })
  }

  registerField(callback: FiledCallback) {
    this.fieldList.push(callback)

    return () => {
      this.fieldList = this.fieldList.filter((fn) => fn !== callback)
    }
  }

  registerWatch(callback: WatchCallback) {
    this.watchList.push(callback)

    return () => {
      this.watchList = this.watchList.filter((fn) => fn !== callback)
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
    this.notifyFieldList(fields, external)
    this.notifyWatchList(fields, external)
  }
}
