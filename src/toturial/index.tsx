import React, {
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

export type Store = Record<string, any>

export interface FieldMeta {
  name: string
  value: any
}

export interface FormContextValue {
  // Context 内保存的每一个表单项
  fieldsStore: Store
  // Context 内下发如何修改表单项值的方法
  setFields: (fields: FieldMeta[]) => void
}

export const FormContext = React.createContext<FormContextValue | null>(null)

// 使用 Context
export function useFormContext() {
  const ctx = useContext(FormContext)
  if (!ctx) {
    throw new Error('FormContext must be used under Form')
  }
  return ctx
}

export interface FormProps {
  // 注意这里我们可以传入默认值，也只允许传入默认值
  initialValues?: Store
  form?: FormAction
  // 表单项改变的方法
  onFieldsChange?: (options: {
    // 改变的表单项
    changedFields: FieldMeta[]
    fieldsStore: Store
  }) => void
  children?: React.ReactNode
}

export const Form: React.FC<FormProps> = ({
  initialValues,
  onFieldsChange,
  form: formProp,
  children,
}) => {
  const [fieldsStore, setFieldsStore] = useState<Store>(
    () => initialValues || {}
  )
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction

  const ctx: FormContextValue = useMemo(() => {
    return {
      fieldsStore,
      // 修改表单项值
      setFields(fields) {
        const newStore = {
          ...fieldsStore,
          ...fields.reduce((acc, next) => {
            acc[next.name] = next.value
            return acc
          }, {} as Store),
        }
        setFieldsStore(newStore)
        onFieldsChangeRef.current?.({
          changedFields: fields,
          fieldsStore: newStore,
        })
      },
    }
  }, [fieldsStore])

  useImperativeHandle(
    form.__INTERNAL__,
    () => ({
      getFields(names) {
        if (!names) {
          return [ctx.fieldsStore]
        }
        return names.map((name) => {
          return ctx.fieldsStore[name]
        })
      },
      setFields: ctx.setFields,
    }),
    [ctx.fieldsStore, ctx.setFields]
  )
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}

export interface FormAction {
  // 修改字段值
  setFields: (fields: FieldMeta[]) => void
  // 获取字段值
  getFields: (names?: string[]) => any[]
}

export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>
}

function throwError(): never {
  throw new Error(
    'Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?'
  )
}

export function useForm(): FormAction {
  const __INTERNAL__ = useRef<FormAction | null>(null)
  return {
    __INTERNAL__,
    getFields(names) {
      const action = __INTERNAL__.current
      if (!action) {
        throwError()
      }
      return action.getFields(names)
    },
    setFields(fields) {
      const action = __INTERNAL__.current
      if (!action) {
        throwError()
      }
      action.setFields(fields)
    },
  } as InternalFormAction
}

export interface FieldProps {
  children: React.ReactNode
  name: string
}

export function getTargetValue(e: any) {
  if (typeof e === 'object' && e !== null && 'target' in e) {
    return e.target.value
  }
  return e
}

export const Field: React.FC<FieldProps> = ({ children, name }) => {
  const { setFields, fieldsStore } = useFormContext()
  const value = fieldsStore[name]
  const onChange = useCallback(
    (e: any) => {
      setFields([{ name, value: getTargetValue(e) }])
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
      return children
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    })
  }, [children, elementOnChange, value])

  return <>{element}</>
}

export function useWatch(name?: string) {
  const { fieldsStore } = useFormContext()
  return name ? fieldsStore[name] : fieldsStore
}
