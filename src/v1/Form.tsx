import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FormContext } from './context'
import { useForm } from './useForm'
import {
  FieldMeta,
  FormAction,
  FormContextValue,
  Store,
  InternalFormAction,
} from './type'

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
  const [changedFields, setChangedFields] = useState<FieldMeta[]>([])
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
        setChangedFields(fields)
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

  // 这里要在 useEffect 也就是刷新 state 后再调用，否则如果在 onFieldsChangeRef 修改值会覆盖掉上次修改
  useEffect(() => {
    onFieldsChangeRef.current?.({
      changedFields,
      fieldsStore,
    })
  }, [fieldsStore, changedFields])
  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>
}
