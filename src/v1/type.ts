export type Store = Record<string, any>

export interface FieldMeta {
  name: string
  value: any
}

export interface FormContextValue {
  // Context 内保存的每一个表单项
  fieldsStore: Store
  // Context 内下发如何修改表单项值的方法
  setFields: (fields: FieldMeta[]) => void
}

// 对外暴露的值
export interface FormAction {
  // 修改字段值
  setFields: (fields: FieldMeta[]) => void
  // 获取字段值
  getFields: (names?: string[]) => any[]
}
// 对内使用的值
export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>
}
