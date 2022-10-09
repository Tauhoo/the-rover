import { Action, ActionType } from './action'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'
import { State, StateManager } from './state'

export class MovePlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.MOVE_PLAYING)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.MOVE_VEHICLE) {
      this.context.subPlayingStateManager = new StandbyPlayingStateManager(
        this.context
      )
    }
  }
}
