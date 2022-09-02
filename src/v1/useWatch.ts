import { useFormContext } from './context'

// 当传入 name 时返回具体的字段值，不传则返回整个 fieldsStore
export function useWatch(name?: string) {
  const { fieldsStore } = useFormContext()
  return name ? fieldsStore[name] : fieldsStore
}
