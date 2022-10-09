import { Action, ActionType } from './action'
import { Game } from './game'
import { Player } from './player'
import { StandbyStateManager } from './standbyState'

export class WaitingStateManager {
  context: Game
  constructor(context: Game) {
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.ADD_PLAYER) {
      this.context.playerManager.addPlayer(new Player(action.info.name))
    }

    if (action.type === ActionType.START_GAME) {
      if (this.context.playerManager.players.length === 0) return
      this.context.stateManager = new StandbyStateManager(this.context)
    }
  }
}
