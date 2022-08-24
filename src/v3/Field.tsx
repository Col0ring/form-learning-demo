import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFormContext } from './context'
import { FieldElement, FieldMeta, Path } from './type'
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
  const fieldRef = useRef<FieldElement>()
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
      ref: fieldRef,
      ...children.props,
    })
  }, [children])
  console.log(111)
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields, external) => {
      if (!fieldRef.current) {
        return
      }
      if (external) {
        const currentField = changedFields.find((field) =>
          IsPathEqual(getNamePath(name), getNamePath(field.name))
        )
        if (currentField) {
          fieldRef.current.value = currentField.value
        }
      }

      if (dependencies) {
        const filteredChangedFields = changedFields.filter((field) =>
          dependencies.find((path) =>
            IsPathEqual(getNamePath(path), getNamePath(field.name))
          )
        )
        if (filteredChangedFields.length && onDependenciesChange) {
          const res = onDependenciesChange(
            filteredChangedFields,
            fieldRef.current.value
          )
          if (res instanceof Promise) {
            res.then((v) => {
              formStore.setFields([{ name, value: v }])
              if (fieldRef.current) {
                fieldRef.current.value = v
              }
            })
          } else {
            formStore.setFields([{ name, value: res }])
            fieldRef.current.value = res
          }
        }
      }
    })
    return unsubscribe
  }, [dependencies, formStore, name, onDependenciesChange])
  return <>{element}</>
}

export default Field
