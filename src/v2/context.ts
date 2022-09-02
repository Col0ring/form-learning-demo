import React, { useContext } from 'react'
import { FormContextValue } from './type'

export const FormContext = React.createContext<FormContextValue | null>(null)

// 使用 Context
export function useFormContext() {
  const ctx = useContext(FormContext)
  if (!ctx) {
    throw new Error('FormContext must be used under Form')
  }
  return ctx
}
