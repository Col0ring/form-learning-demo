import { createContext, useContext } from 'react'
import { FormStore } from './store'

export interface FormContextValue {
  form: FormStore
}

export interface InternalFormContextValue
  extends Omit<FormContextValue, 'form'> {
  __updater__: {}
  form: FormContextValue['form'] | null
}

export const FormContext = createContext<InternalFormContextValue>({
  form: null,
  __updater__: {}
})

export function useFormContext(): FormContextValue {
  const { form, __updater__, ...rest } = useContext(FormContext)
  if (!form) {
    throw new Error('FormContext must be used under Form')
  }
  return {
    form,
    ...rest
  }
}
