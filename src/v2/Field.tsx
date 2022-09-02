import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from './context'

export interface FieldProps {
  children: React.ReactNode
  name: string
}

export function getTargetValue(e: any) {
  if (typeof e === 'object' && e !== null && 'target' in e) {
    return e.target.value
  }
  return e
}
export const Field: React.FC<FieldProps> = ({ children, name }) => {
  const { formStore } = useFormContext()
  // 内部自己维护状态
  const [value, setValue] = useState(() => formStore.getFields([name])[0])
  const onChange = useCallback(
    (e: any) => {
      formStore.setFields([{ name, value: getTargetValue(e) }])
    },
    [formStore, name]
  )
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const elementOnChange = useCallback((e: any) => {
    return onChangeRef.current(e)
  }, [])
  const element = useMemo(() => {
    if (!React.isValidElement(children)) {
      return children
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    })
  }, [children, elementOnChange, value])

  // 订阅一个监听，当 changedFields 中包含当前的字段时更新 value 值
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      const targetField = changedFields.find(
        (changedField) => name === changedField.name
      )
      targetField && setValue(targetField.value)
    })
    return unsubscribe
  }, [formStore, name])
  return <>{element}</>
}
