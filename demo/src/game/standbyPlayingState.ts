import { Action, ActionType, PlayingActionType } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { MovePlayingStateManager } from './movePlayingState'
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
      if ((action.info as PlayingActionType) === PlayingActionType.SCAN) {
        this.context.subPlayingStateManager = new ScanPlayingStateManager(
          this.context
        )
      } else if (
        (action.info as PlayingActionType) === PlayingActionType.MOVE_VEHICLE
      ) {
        this.context.subPlayingStateManager = new MovePlayingStateManager(
          this.context
        )
      }
    }
  }
}
