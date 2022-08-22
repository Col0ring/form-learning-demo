import React, { useImperativeHandle, useMemo } from 'react'
import { FormContext } from './context'
import { FormAction, FormContextValue, InternalFormAction, Store } from './type'
import { useForm } from './useForm'
import { getNamePath, getValue, setValue } from './utils'

export interface FormProps {
  children: React.ReactNode
  initialValues?: Store
  form?: FormAction
}

export const Form: React.FC<FormProps> = ({
  children,
  initialValues,
  form: formProp,
}) => {
  const [filesStore, setFilesStore] = React.useState<Store>(
    () => initialValues || {}
  )
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  const ctx: FormContextValue = useMemo(() => {
    return {
      setFields(fields) {
        setFilesStore((store) => {
          let newStore = store
          fields.forEach((field) => {
            newStore = setValue(store, getNamePath(field.name), field.value)
          })
          return newStore
        })
      },
      getFields(paths) {
        if (!paths) {
          return filesStore
        }
        return paths.map((path) => {
          return getValue(filesStore, getNamePath(path))
        })
      },
    }
  }, [filesStore])
  useImperativeHandle(form.__INTERNAL__, () => ctx, [ctx])
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}

export default Form
