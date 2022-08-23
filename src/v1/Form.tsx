import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FormContext } from './context'
import {
  FieldMeta,
  FormAction,
  FormContextValue,
  InternalFormAction,
  Store,
} from './type'
import { useForm } from './useForm'
import { getNamePath, getValue, setValue } from './utils'

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
  const [fieldsStore, setFieldsStore] = React.useState<Store>(
    () => initialValues || {}
  )
  const [changedFields, setChangedFields] = useState<FieldMeta[]>([])
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  const action: Omit<FormContextValue, 'changedFields'> = useMemo(() => {
    return {
      setFields(fields, external) {
        let newStore = fieldsStore
        !external &&
          setChangedFields(
            fields.map((field) => {
              newStore = setValue(
                newStore,
                getNamePath(field.name),
                field.value
              )
              return {
                ...field,
                name: getNamePath(field.name),
              }
            })
          )
        setFieldsStore(newStore)
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

  const ctx: FormContextValue = useMemo(() => {
    return {
      ...action,
      changedFields,
    }
  }, [action, changedFields])
  useEffect(() => {
    onFieldsChangeRef.current?.({
      changedFields,
      fieldsStore: fieldsStore,
    })
  }, [fieldsStore, changedFields])
  useImperativeHandle(
    form.__INTERNAL__,
    () => ({
      ...action,
      setFields: (fields) => action.setFields(fields, true),
    }),
    [action]
  )
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}

export default Form
