import React, { useCallback, useMemo, useRef } from 'react'
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
  const { setFields, fieldsStore } = useFormContext()
  // 实现 value 与 onChange
  const value = fieldsStore[name]
  const onChange = useCallback(
    (e: any) => {
      setFields([{ name, value: getTargetValue(e) }])
    },
    [name, setFields]
  )
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  // 为了确保 onChange 不会改变地址指向
  const elementOnChange = useCallback((e: any) => {
    return onChangeRef.current(e)
  }, [])
  const element = useMemo(() => {
    if (!React.isValidElement(children)) {
      return children
    }
    // 克隆 children，传入 value 与 onChange
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    })
  }, [children, value, elementOnChange])

  return <>{element}</>
}
