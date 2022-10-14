import { Action } from './action'
import { Game } from './game'
import { PlayerGameInfo } from './playerGameInfo'
import { State, StateManager } from './state'

export class EndStateManager extends StateManager {
  context: Game
  winnerID: string
  playerGameInfos: PlayerGameInfo[]

  constructor(
    context: Game,
    winnerID: string,
    playerGameInfos: PlayerGameInfo[]
  ) {
    super(State.END)
    this.context = context
    this.winnerID = winnerID
    this.playerGameInfos = playerGameInfos
  }

  doAction(action: Action): void {}
}
