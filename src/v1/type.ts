import React from 'react'
export type NamePath = (string | number)[]
export type Path = number | string | NamePath
export type Store = Record<string, any>
export interface FieldMeta {
  name: Path
  value: any
}

export interface FormContextValue {
  changedFields: FieldMeta[]
  setFields: (fields: FieldMeta[], external?: boolean) => void
  getFields: (paths?: Path[]) => any[]
}

export interface FormAction {
  setFields: (fields: FieldMeta[]) => void
  getFields: (paths?: Path[]) => any[]
}

export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>
}
