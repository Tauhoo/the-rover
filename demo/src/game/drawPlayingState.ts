import { Action, ActionType } from './action'
import { Game } from './game'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'

export class DrawPlayingStateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.DRAW_CARD) {
      this.context.subPlayingStateManager = new StandbyPlayingStateManager(
        this.context
      )
    }
  }
}
