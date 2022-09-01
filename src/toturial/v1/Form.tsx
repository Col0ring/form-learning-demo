import { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { InternalFormAction, useForm } from '../v3'
import { FormContext } from './context'
import { FieldMeta, FormAction, FormContextValue, Store } from './type'

export interface FormProps {
  // 注意这里我们可以传入默认值，也只允许传入默认值
  initialValues?: Store
  // 表单项改变的方法
  onFieldsChange?: (options: {
    // 改变的表单项
    changedFields: FieldMeta[]
    fieldsStore: Store
  }) => void
  children?: React.ReactNode
  // 增加一个 form 属性
  form?: FormAction
}

export const Form: React.FC<FormProps> = ({
  initialValues,
  onFieldsChange,
  children,
  form: formProp,
}) => {
  const [fieldsStore, setFieldsStore] = useState<Store>(
    () => initialValues || {}
  )
  // 增加默认参数，避免后续使用报错
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange

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
    // 这里会依赖之前定义好的 ctx 上的值
    [ctx.fieldsStore, ctx.setFields]
  )
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}
