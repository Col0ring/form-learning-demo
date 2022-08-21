import { NamePath, Path, Store } from './type'

export function getNamePath(val: Path): NamePath {
  return Array.isArray(val) ? val : [val]
}

export function getValue(store: Store, namePath: NamePath) {
  let value = store
  for (let i = 0; i < namePath.length; i++) {
    if (value === null || value === undefined) {
      return
    }
    value = value[namePath[i]]
  }
  return value
}

export function setValue(store: Store, namePath: NamePath, value: any): Store {
  const newStore = store
  return newStore
}
