import { useFormContext } from './context'
import { Path } from './type'

export function useWatch(path?: Path) {
  const { getFields } = useFormContext()
  return path ? getFields([path])[0] : getFields()[0]
}
