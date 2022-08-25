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

export type SubscribeCallback = (changedFields: FieldMeta[]) => void

export class FormStore {
  private store: Store = {}
  private observers: SubscribeCallback[] = []

  constructor(initialValues?: Store) {
    initialValues && this.updateStore(initialValues)
  }

  private updateStore(nextStore: Store) {
    this.store = nextStore
  }

  private notify(changedFiles: FieldMeta[]) {
    this.observers.forEach((callback) => {
      callback(changedFiles)
    })
  }

  subscribe(callback: SubscribeCallback) {
    this.observers.push(callback)
    return () => {
      this.observers = this.observers.filter((fn) => fn !== callback)
    }
  }

  getFields(names?: string[]): any[] {
    if (!names) {
      return [this.store]
    }
    return names.map((name) => {
      return this.store[name]
    })
  }

  setFields(fields: FieldMeta[]) {
    const newStore = {
      ...this.store,
      ...fields.reduce((acc, next) => {
        acc[next.name] = next.value
        return acc
      }, {} as Store),
    }
    this.updateStore(newStore)
    this.notify(fields)
  }
}

export interface FormContextValue {
  // // Context 内保存的每一个表单项
  // fieldsStore: Store
  // // Context 内下发如何修改表单项值的方法
  // setFields: (fields: FieldMeta[]) => void
  formStore: FormStore
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
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formStore = useMemo(() => new FormStore(initialValues), [])

  const ctx: FormContextValue = useMemo(() => {
    return {
      formStore,
    }
  }, [formStore])

  useImperativeHandle(
    form.__INTERNAL__,
    () => ({
      setFields(fields) {
        formStore.setFields(fields)
      },
      getFields(paths) {
        return formStore.getFields(paths)
      },
    }),
    [formStore]
  )

  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      onFieldsChangeRef.current?.({
        changedFields,
        fieldsStore: formStore.getFields(),
      })
    })
    return unsubscribe
  }, [formStore])
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
  const { formStore } = useFormContext()
  const [value, setValue] = useState(() => formStore.getFields([name])[0])
  const onChange = useCallback(
    (e: any) => {
      formStore.setFields([{ name, value: getTargetValue(e) }])
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
      return children
    }
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    })
  }, [children, elementOnChange, value])
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      const targetField = changedFields.find(
        (changedField) => name === changedField.name
      )
      targetField && setValue(targetField.value)
    })
    return unsubscribe
  }, [formStore, name])
  return <>{element}</>
}

export function useWatch(name?: string) {
  const { formStore } = useFormContext()
  const [value, setValue] = useState(() =>
    name ? formStore.getFields([name])[0] : formStore.getFields()[0]
  )
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      if (name) {
        const targetField = changedFields.find(
          (changedField) => name === changedField.name
        )
        targetField && setValue(targetField.value)
      }
      {
        setValue(formStore.getFields()[0])
      }
    })
    return unsubscribe
  }, [formStore, name])

  return value
}
