import { Action, ActionManager } from './action'
import { PlayerManager } from './player'
import { StateManager } from './state'
import { WaitingStateManager } from './waitingPlayerState'

type GameOptions = {
  maxPlayer: number
}

export class Game {
  stateManager: StateManager
  playerManager: PlayerManager
  actionManager: ActionManager
  options: GameOptions

  constructor(options: GameOptions) {
    this.options = options
    this.playerManager = new PlayerManager()
    this.stateManager = new WaitingStateManager(this)
    this.actionManager = new ActionManager()

    this.actionManager.registerListener((action: Action) => {
      this.stateManager.doAction(action)
    })
  }
}
