import { useRef } from 'react'
import { FormAction, InternalFormAction } from './type'

function throwError(): never {
  throw new Error(
    'Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?'
  )
}

export function useForm(): FormAction {
  // 在容器内部需要绑定的值，不将其暴露给用户
  const __INTERNAL__ = useRef<FormAction | null>(null)
  return {
    __INTERNAL__,
    // 额外封装一层方法调用
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
