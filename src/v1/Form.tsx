import React, { useImperativeHandle, useMemo, useRef } from 'react'
import { FieldValue } from '../v2'
import { FormContext } from './context'
import { FormAction, FormContextValue, InternalFormAction, Store } from './type'
import { useForm } from './useForm'
import { getNamePath, getValue, setValue } from './utils'

export interface FormProps {
  children: React.ReactNode
  initialValues?: Store
  form?: FormAction
  onFieldsChange?: (options: {
    changedFields: FieldValue[]
    fieldsStore: Store
  }) => void
}

export const Form: React.FC<FormProps> = ({
  children,
  initialValues,
  onFieldsChange,
  form: formProp,
}) => {
  const [fieldsStore, setFieldsStore] = React.useState<Store>(
    () => initialValues || {}
  )
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  const ctx: FormContextValue = useMemo(() => {
    return {
      setFields(fields) {
        let newStore = fieldsStore
        fields.forEach((field) => {
          newStore = setValue(newStore, getNamePath(field.name), field.value)
        })
        setFieldsStore(newStore)
        onFieldsChangeRef.current?.({
          changedFields: fields,
          fieldsStore: fieldsStore,
        })
      },
      getFields(paths) {
        if (!paths) {
          return [fieldsStore]
        }
        return paths.map((path) => {
          return getValue(fieldsStore, getNamePath(path))
        })
      },
    }
  }, [fieldsStore])
  useImperativeHandle(form.__INTERNAL__, () => ctx, [ctx])
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}

export default Form
