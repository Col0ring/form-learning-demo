import { Field, FieldsValue, Path, Store } from './type'
import { getNamePath, getValue, noop, setValue } from './utils'

export class FormStore {
  private store: Store = {}

  private forceUpdate = noop

  constructor(forceUpdate: () => void) {
    this.forceUpdate = forceUpdate
  }

  private updateStore(nextStore: Store) {
    this.store = nextStore
    this.forceUpdate()
  }

  getFields(paths?: Path[]): FieldsValue {
    if (!paths) {
      return {
        ...this.store
      }
    }
    return paths.map((path) => {
      return getValue(this.store, getNamePath(path))
    })
  }

  setFields(fields: Field[]) {
    fields.forEach((field) => {
      this.updateStore(
        setValue(this.store, getNamePath(field.name), field.value)
      )
    })
  }
}
