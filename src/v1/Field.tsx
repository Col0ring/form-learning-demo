import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFormContext } from './context'
import { FieldMeta, Path } from './type'
import { getNamePath, getTargetValue, IsPathEqual } from './utils'

export interface FieldProps {
  children: React.ReactNode
  name: Path
  dependencies?: Path[]
  onDependenciesChange?: (fields: FieldMeta[], value: any) => Promise<any> | any
}

export const Field: React.FC<FieldProps> = ({
  children,
  name,
  dependencies,
  onDependenciesChange,
}) => {
  const { setFields, getFields, changedFields } = useFormContext()
  const value = useMemo(() => getFields([name])[0], [getFields, name])
  const onChange = useCallback(
    (e: any) => {
      setFields([{ name: getNamePath(name), value: getTargetValue(e) }])
    },
    [name, setFields]
  )
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const elementOnChange = useCallback((e: any) => {
    return onChangeRef.current(e)
  }, [])
  const element = useMemo(() => {
    if (!React.isValidElement(children)) {
      return null
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    })
  }, [children, elementOnChange, value])

  useEffect(() => {
    if (dependencies) {
      const filteredChangedFields = changedFields.filter((field) =>
        dependencies.find((path) =>
          IsPathEqual(getNamePath(path), getNamePath(field.name))
        )
      )
      if (filteredChangedFields.length && onDependenciesChange) {
        const res = onDependenciesChange(filteredChangedFields, value)
        if (res instanceof Promise) {
          res.then((v) => {
            setFields([{ name, value: v }])
          })
        } else {
          setFields([{ name, value: res }])
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedFields])
  return <>{element}</>
}

export default Field
