import { Action, ActionType } from './action'
import { EndStateManager } from './endGameState'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'
import { State, StateManager } from './state'
import { WaitingStateManager } from './waitingPlayerState'

export enum ScanResult {
  NEAR = 'NEAR',
  FOUND = 'FOUND',
  NOT_NEAR = 'NOT_NEAR',
}
const fixedScanRadiusLength = 5

export class ScanPlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.SCAN_PLAYING)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.SCAN) {
      const result = this.scan()
      const currentPlayer = this.context.getCurrentPlayerGameInfo()
      currentPlayer.addScanRecordAtCurrentPosition(result)

      if (result === ScanResult.FOUND) {
        this.context.context.stateManager = new EndStateManager(
          this.context.context,
          currentPlayer.player.id,
          this.context.playerGameInfos
        )
      }

      this.context.subPlayingStateManager = new StandbyPlayingStateManager(
        this.context
      )
    }
  }

  scan(): ScanResult {
    const playerPosition = this.context
      .getCurrentPlayerGameInfo()
      .position.clone()
    const graxiumPosition = this.context.board.graxiumPosition.clone()
    if (playerPosition.isEqualTo(graxiumPosition)) return ScanResult.FOUND
    if (
      Math.abs(graxiumPosition.distanceSq(playerPosition)) <=
      fixedScanRadiusLength
    )
      return ScanResult.NEAR
    return ScanResult.NOT_NEAR
  }
}
