import React from 'react'
export type NamePath = (string | number)[]
export type Path = number | string | NamePath
export type Store = Record<string, any>
export type FieldsValue = Record<string, any>
export interface FieldValue {
  name: Path
  value: any
}

export interface FormContextValue {
  setFields: (fields: FieldValue[]) => void
  getFields: (paths?: Path[]) => FieldsValue
}

export interface FormAction {
  setFields: (fields: FieldValue[]) => void
  getFields: (paths?: Path[]) => FieldsValue
}

export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>
}
