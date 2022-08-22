import React, { useCallback, useMemo } from 'react'
import { useFormContext } from './context'
import { Path } from './type'
import { getTargetValue } from './utils'

export interface FieldProps {
  children: React.ReactNode
  name: Path
}

export const Field: React.FC<FieldProps> = ({ children, name }) => {
  const { setFields, getFields } = useFormContext()
  const value = useMemo(() => getFields([name])[0], [getFields, name])
  const onChange = useCallback(
    (e: any) => {
      setFields([{ name, value: getTargetValue(e) }])
    },
    [name, setFields]
  )

  const element = useMemo(() => {
    if (!React.isValidElement(children)) {
      return null
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange,
      value,
      ...children.props,
    })
  }, [children, onChange, value])
  return <>{element}</>
}

export default Field
