import { useRef } from 'react'
import { FormAction, InternalFormAction } from './type'

function throwError(): never {
  throw new Error(
    'Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?'
  )
}

export function useForm(): FormAction {
  const __INTERNAL__ = useRef<FormAction | null>(null)
  return {
    __INTERNAL__,
    getFields(paths) {
      const action = __INTERNAL__.current
      if (!action) {
        throwError()
      }
      return action.getFields(paths)
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
