import { Action } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { Game } from './game'
import { StateManager } from './state'

export class PlayingStateManager {
  context: Game
  currentTurnPlayerIndex: number = 0
  subPlayingStateManager: StateManager

  constructor(context: Game) {
    this.context = context
    this.subPlayingStateManager = new DrawPlayingStateManager(this)
  }

  doAction(action: Action): void {
    this.subPlayingStateManager.doAction(action)
  }
}
