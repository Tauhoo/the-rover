import { Action } from './action'

export interface StateManager {
  doAction(action: Action): void
}
