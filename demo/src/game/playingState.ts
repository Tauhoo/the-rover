import { Action } from './action'
import { Board, BoardOptions } from './board'
import { DrawPlayingStateManager } from './drawPlayingState'
import { Game } from './game'
import { PlayerGameInfo } from './playerGameInfo'
import { State, StateManager } from './state'

export class PlayingStateManager extends StateManager {
  context: Game
  currentTurnPlayerIndex: number = 0
  subPlayingStateManager: StateManager
  playerGameInfos: PlayerGameInfo[]
  board: Board

  constructor(
    context: Game,
    boardOptions: BoardOptions,
    playerGameInfos: PlayerGameInfo[]
  ) {
    super(State.PLAYING)
    this.context = context
    this.subPlayingStateManager = new DrawPlayingStateManager(this)
    this.board = new Board(boardOptions)
    this.playerGameInfos = playerGameInfos
  }

  getCurrentPlayerGameInfo(): PlayerGameInfo {
    return this.playerGameInfos[this.currentTurnPlayerIndex]
  }

  getPlayerInfoByID(id: string): PlayerGameInfo | null {
    const result = this.playerGameInfos.filter(info => info.player.id === id)
    if (result.length !== 1) {
      return null
    } else {
      return result[0]
    }
  }

  doAction(action: Action): void {
    this.subPlayingStateManager.doAction(action)
  }
}
