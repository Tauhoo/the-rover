import { Action, ActionType } from './action'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'
import { State, StateManager } from './state'

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
      this.context
        .getCurrentPlayerGameInfo()
        .addScanRecordAtCurrentPosition(this.scan())

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
