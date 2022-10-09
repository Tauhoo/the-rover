import { Action, ActionType } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { PlayingStateManager } from './playingState'
import { ScanPlayingStateManager } from './scanPlayingState'
import { State, StateManager } from './state'

export class StandbyPlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.STANDBY_PLAYING)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.END_TURN) {
      this.context.currentTurnPlayerIndex =
        (this.context.currentTurnPlayerIndex + 1) %
        this.context.context.playerManager.players.length

      this.context.subPlayingStateManager = new DrawPlayingStateManager(
        this.context
      )
    }

    if (action.type === ActionType.CHOOSE_ACTION) {
      this.context.subPlayingStateManager = new ScanPlayingStateManager(
        this.context
      )
    }
  }
}
