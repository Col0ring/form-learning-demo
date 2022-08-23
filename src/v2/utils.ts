import { NamePath, Path, Store } from './type'

export function noop() {}

export function getNamePath(val: Path): NamePath {
  return Array.isArray(val) ? val : [val]
}

export function getValue(store: Store, namePath: NamePath): any {
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
  if (!namePath.length) {
    return value
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
  if (typeof e === 'object' && e !== null && 'target' in e) {
    return e.target.value
  }
  return e
}

export function IsPathEqual(path1: Path, path2: Path) {
  const namePath1 = getNamePath(path1)
  const namePath2 = getNamePath(path2)
  const len1 = namePath1.length
  const len2 = namePath2.length
  if (len1 !== len2) {
    return false
  }
  for (let i = 0; i < len1; i++) {
    if (namePath1[i] !== namePath2[i]) {
      return false
    }
  }
  return true
}
