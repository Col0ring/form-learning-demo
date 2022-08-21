import { Path, Store } from './type'
import { getNamePath } from './utils'

export class FormStore {
  private store: Store = {}

  getFields(paths?: Path[]) {
    if (!paths) {
      return {
        ...this.store
      }
    }
    return paths.map((path) => {
      return getNamePath(path)
    })
  }
}
