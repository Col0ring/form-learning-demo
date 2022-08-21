import React, { useCallback, useEffect, useMemo } from 'react'
import { useFormContext } from './context'
import { getTargetValue } from './utils'

export interface FormProps {
  children: React.ReactNode
  name: string
}

const Field: React.FC<FormProps> = ({ children, name }) => {
  const { form } = useFormContext()
  const value = form.getFields([name])[name]
  const onChange = useCallback(
    (e: any) => {
      form.setFields([{ name, value: getTargetValue(e) }])
    },
    [form]
  )
  if (!React.isValidElement(children)) {
    return null
  }
  const element = useMemo(
    () =>
      React.cloneElement(children as React.ReactElement, {
        onChange,
        value,
        ...children.props
      }),
    [children, onChange, value]
  )
  return <>{element}</>
}

export default Field
