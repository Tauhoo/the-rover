import { Action } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { Game } from './game'
import { NewDefaultPlayerGameInfo, PlayerGameInfo } from './PlayerGameInfo'
import { State, StateManager } from './state'

export class PlayingStateManager extends StateManager {
  context: Game
  currentTurnPlayerIndex: number = 0
  subPlayingStateManager: StateManager
  playerGameInfos: PlayerGameInfo[]

  constructor(context: Game) {
    super(State.PLAYING)
    this.context = context
    this.subPlayingStateManager = new DrawPlayingStateManager(this)
    this.playerGameInfos = this.context.playerManager.players.map(player =>
      NewDefaultPlayerGameInfo(player)
    )
  }

  getCurrentPlayerGameInfo(): PlayerGameInfo {
    return this.playerGameInfos[this.currentTurnPlayerIndex]
  }

  doAction(action: Action): void {
    this.subPlayingStateManager.doAction(action)
  }
}
