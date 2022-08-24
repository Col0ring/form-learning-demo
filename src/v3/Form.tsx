import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { FormContext } from './context'
import { FormStore } from './store'
import {
  FieldMeta,
  FormAction,
  FormContextValue,
  InternalFormAction,
  Store,
} from './type'
import { useForm } from './useForm'

export interface FormProps {
  children: React.ReactNode
  initialValues?: Store
  form?: FormAction
  onFieldsChange?: (options: {
    changedFields: FieldMeta[]
    fieldsStore: Store
  }) => void
}

export const Form: React.FC<FormProps> = ({
  children,
  initialValues,
  onFieldsChange,
  form: formProp,
}) => {
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formStore = useMemo(() => new FormStore(initialValues), [])

  const action: FormAction = useMemo(() => {
    return {
      setFields(fields) {
        formStore.setFields(fields, true)
      },
      getFields(paths) {
        return formStore.getFields(paths)
      },
    }
  }, [formStore])

  const ctx: FormContextValue = useMemo(() => {
    return {
      formStore,
    }
  }, [formStore])
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields, external) => {
      !external &&
        onFieldsChangeRef.current?.({
          changedFields,
          fieldsStore: formStore.getFields(),
        })
    })
    return unsubscribe
  }, [formStore])
  useImperativeHandle(form.__INTERNAL__, () => action, [action])
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}

export default Form
