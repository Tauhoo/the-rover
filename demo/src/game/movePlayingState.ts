import Victer from 'victor'
import { Action, ActionType } from './action'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'
import { State, StateManager } from './state'

export type MoveVehicleInfo = {
  path: Victer[]
}

const fixedLength = 5

export class MovePlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.MOVE_PLAYING)
    this.context = context
  }

  validatePath(path: Victer[]): boolean {
    if (path.length === 0) {
      return false
    }
    for (let index = 0; index < path.length - 1; index++) {
      const current = path[index].clone()
      const next = path[index].clone()
      const { x, y } = current.subtract(next)
      if (Math.abs(x) + Math.abs(y) != 1) {
        return false
      }
    }
    return true
  }

  doAction(action: Action): void {
    if (action.type === ActionType.MOVE_VEHICLE) {
      const info = action.info as MoveVehicleInfo
      this.move(info)
      this.context.subPlayingStateManager = new StandbyPlayingStateManager(
        this.context
      )
    }
  }

  move(info: MoveVehicleInfo) {
    const playerInfo = this.context.getCurrentPlayerGameInfo()
    if (!this.validatePath(info.path)) return
    if (info.path[0] !== playerInfo.position) return
    playerInfo.position = info.path[info.path.length - 1]
  }
}
