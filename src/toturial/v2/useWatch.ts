import { useEffect, useState } from 'react'
import { useFormContext } from './context'

// 其实内部的订阅逻辑和 Field 是类似的
export function useWatch(name?: string) {
  const { formStore } = useFormContext()
  // 内部维护一个状态值，当监听到指定字段值改变时，会更新当前调用 useWatch 的组件
  const [value, setValue] = useState(() =>
    name ? formStore.getFields([name])[0] : formStore.getFields()[0]
  )
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      if (name) {
        const targetField = changedFields.find(
          (changedField) => name === changedField.name
        )
        targetField && setValue(targetField.value)
      }
      {
        setValue(formStore.getFields()[0])
      }
    })
    return unsubscribe
  }, [formStore, name])

  return value
}
