import React from 'react'
import { FormStore } from './store'
export type NamePath = (string | number)[]
export type Path = number | string | NamePath
export type Store = Record<string, any>
export interface FieldMeta {
  name: Path
  value: any
}

export type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

export type SubscribeCallback = (
  changedFields: FieldMeta[],
  external?: boolean
) => void

export interface FormContextValue {
  formStore: FormStore
}

export interface FormAction {
  setFields: (fields: FieldMeta[]) => void
  getFields: (paths?: Path[]) => any[]
}

export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>
}
