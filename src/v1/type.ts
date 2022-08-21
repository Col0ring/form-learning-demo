export type NamePath = (string | number)[]
export type Path = number | string | NamePath
export type Store = Record<string, any>
export type FieldsValue = Record<string, any>
export interface Field {
  name: Path
  value: any
}
