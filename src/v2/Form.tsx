import { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
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
  // 不再需要保存 fields 状态
  // const [fieldsStore, setFieldsStore] = useState<Store>(
  //   () => initialValues || {}
  // )
  const onFieldsChangeRef = useRef(onFieldsChange)
  onFieldsChangeRef.current = onFieldsChange
  const defaultForm = useForm()
  const form = (formProp || defaultForm) as InternalFormAction
  // 创建 formStore 实例
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const formStore = useMemo(() => new FormStore(initialValues), [])
  // 改变 context value
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

  // 加入一个监听，为 onFieldsChange 回调服务
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
