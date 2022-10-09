import { Action, ActionType, Agent } from './action'
import { Game } from './game'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'
import { State, StateManager } from './state'

export class ScanPlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.SCAN_PLAYING)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.SCAN) {
      this.context.subPlayingStateManager = new StandbyPlayingStateManager(
        this.context
      )
    }
  }
}
