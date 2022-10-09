import { Action, ActionManager } from './action'
import { PlayerManager } from './player'
import { StateManager } from './state'
import { WaitingStateManager } from './waitingPlayerState'

export class Game {
  stateManager: StateManager
  playerManager: PlayerManager
  actionManager: ActionManager

  constructor() {
    this.playerManager = new PlayerManager()
    this.stateManager = new WaitingStateManager(this)
    this.actionManager = new ActionManager()

    this.actionManager.registerListener((action: Action) => {
      this.stateManager.doAction(action)
    })
  }
}
