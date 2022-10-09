import { Action, ActionType } from './action'
import { Game } from './game'
import { Player } from './player'

export class WaitingStateManager {
  context: Game
  constructor(context: Game) {
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.ADD_PLAYER) {
      this.context.playerManager.addPlayer(new Player(action.info.name))
    }
  }
}
