import { Action, ActionType } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { PlayingStateManager } from './playingState'
import { ScanPlayingStateManager } from './scanPlayingState'

export class StandbyPlayingStateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
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
