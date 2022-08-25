import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFormContext } from './context'
import { FieldMeta, Path } from './type'
import { useWatch } from './useWatch'
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
  const { formStore } = useFormContext()
  const value = useWatch(name)
  const valueRef = useRef(value)
  valueRef.current = value
  const onChange = useCallback(
    (e: any) => {
      formStore.setFields([
        { name: getNamePath(name), value: getTargetValue(e) },
      ])
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
      return null
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    })
  }, [children, elementOnChange, value])

  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      if (dependencies) {
        const filteredChangedFields = changedFields.filter((field) =>
          dependencies.find((path) =>
            IsPathEqual(getNamePath(path), getNamePath(field.name))
          )
        )
        if (filteredChangedFields.length && onDependenciesChange) {
          const res = onDependenciesChange(
            filteredChangedFields,
            valueRef.current
          )
          if (res instanceof Promise) {
            res.then((v) => {
              formStore.setFields([{ name, value: v }])
            })
          } else {
            formStore.setFields([{ name, value: res }])
          }
        }
      }
    })
    return unsubscribe
  }, [dependencies, formStore, name, onDependenciesChange])
  return <>{element}</>
}

export default Field
