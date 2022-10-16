import { Action, ActionType } from './action'
import { BoardOptions } from './board'
import { Game } from './game'
import { Player } from './player'
import { PlayerGameInfo } from './playerGameInfo'
import { PlayingStateManager } from './playingState'
import { State, StateManager } from './state'

export class StandbyStateManager extends StateManager {
  context: Game
  playerStandbyStatus: Map<string, boolean>
  constructor(context: Game) {
    super(State.STANDBY)
    this.context = context
    this.playerStandbyStatus = new Map<string, boolean>(
      this.context.playerManager.players.map(
        (player: Player): [string, boolean] => [player.id, false]
      )
    )
  }

  doAction(action: Action): void {
    if (action.type === ActionType.PLAYER_IS_READY) {
      this.playerStandbyStatus.set(action.info.id, true)
      if (this.isAllPlayerReady()) {
        this.context.stateManager = new PlayingStateManager(
          this.context,
          action.info.boardGameOptions,
          action.info.playerGameInfos
        )
      }
    }
  }

  isAllPlayerReady(): boolean {
    let isReady: boolean = true
    for (const [_, status] of this.playerStandbyStatus.entries()) {
      isReady = isReady && status
    }

    return isReady
  }
}
