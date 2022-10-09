import { Action } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { Game } from './game'
import { State, StateManager } from './state'

export class PlayingStateManager extends StateManager {
  context: Game
  currentTurnPlayerIndex: number = 0
  subPlayingStateManager: StateManager

  constructor(context: Game) {
    super(State.PLAYING)
    this.context = context
    this.subPlayingStateManager = new DrawPlayingStateManager(this)
  }

  doAction(action: Action): void {
    this.subPlayingStateManager.doAction(action)
  }
}
