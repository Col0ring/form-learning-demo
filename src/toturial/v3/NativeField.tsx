import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFormContext } from './context'
import { FieldProps } from './Field'
import { FieldElement } from './type'

function getTargetValue(e: any) {
  if (typeof e === 'object' && e !== null && 'target' in e) {
    return e.target.value
  }
  return e
}

export const NativeField: React.FC<FieldProps> = ({ children, name }) => {
  const { formStore } = useFormContext()
  // 使用 ref 保存原生表单控件
  const fieldRef = useRef<FieldElement>()
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
      ...children.props,
    })
  }, [children, elementOnChange])

  // 订阅一个监听，当 changedFields 中包含当前的字段时更新 value 值
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      if (!fieldRef.current) {
        return
      }
      const targetField = changedFields.find(
        (changedField) => name === changedField.name
      )
      // 将 setValue 改为直接修改 ref 的值
      if (targetField) {
        fieldRef.current.value = targetField.value
      }
    })
    return unsubscribe
  }, [formStore, name])
  return <>{element}</>
}
