import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  const { formStore } = useFormContext()
  const [value, setValue] = useState(() => formStore.getFields([name])[0])
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
  const element = useMemo(() => {
    if (!React.isValidElement(children)) {
      return null
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange: onChangeRef.current,
      value,
      ...children.props,
    })
  }, [children, value])

  useEffect(() => {
    const unwatch = formStore.registerField((changedFields) => {
      setValue((prevValue: any) => {
        const currentField = changedFields.find((field) =>
          IsPathEqual(getNamePath(name), getNamePath(field.name))
        )

        if (dependencies) {
          const filteredChangedFields = changedFields.filter((field) =>
            dependencies.find((path) =>
              IsPathEqual(getNamePath(path), getNamePath(field.name))
            )
          )
          if (filteredChangedFields.length && onDependenciesChange) {
            const res = onDependenciesChange(filteredChangedFields, prevValue)
            if (res instanceof Promise) {
              res.then((v) => {
                setValue(v)
              })
            }
            return prevValue
          }
        }
        if (currentField) {
          return currentField.value
        }
        return prevValue
      })
    })
    return unwatch
  }, [dependencies, formStore, name, onDependenciesChange])
  return <>{element}</>
}

export default Field
