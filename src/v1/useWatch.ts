import { useFormContext } from './context'
import { Path } from './type'

export function useWatch(paths?: Path[]) {
  const { getFields } = useFormContext()
  return getFields(paths)
}
