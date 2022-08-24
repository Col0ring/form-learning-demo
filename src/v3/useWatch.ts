import { useEffect, useState } from 'react'
import { IsPathEqual } from '../v1'
import { useFormContext } from './context'
import { Path } from './type'
import { getNamePath } from './utils'

export function useWatch(path?: Path) {
  const { formStore } = useFormContext()
  const [state, setState] = useState(() =>
    path ? formStore.getFields([path])[0] : formStore.getFields()[0]
  )
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      if (path) {
        const targetField = changedFields.find((changedField) =>
          IsPathEqual(getNamePath(path), getNamePath(changedField.name))
        )
        targetField && setState(targetField.value)
      } else {
        setState(formStore.getFields()[0])
      }
    })
    return unsubscribe
  }, [formStore, path])
  return state
}
