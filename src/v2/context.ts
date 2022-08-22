import { createContext, useContext } from 'react'
import { FormContextValue } from './type'

export const FormContext = createContext<FormContextValue | null>(null)

export function useFormContext() {
  const ctx = useContext(FormContext)
  if (!ctx) {
    throw new Error('FormContext must be used under Form')
  }
  return ctx
}
