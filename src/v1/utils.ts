import { NamePath, Path, Store } from './type'

export function noop() {}

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

export function setValue(store: Store, namePath: NamePath, value: any) {
  if (!namePath.length) {
    return store
  }

  const [path, ...restPath] = namePath

  let newStore: Store
  if (!store && typeof path === 'number') {
    newStore = []
  } else if (Array.isArray(store)) {
    newStore = [...store]
  } else {
    newStore = { ...store }
  }

  newStore[path] = setValue(newStore[path], restPath, value)

  return newStore
}

export function getTargetValue(e: any) {
  if ('target' in e) {
    return e.target.value
  }
  return e
}
