import { Action, ActionType, Agent } from './action'
import { DrawPlayingStateManager } from './drawPlayingState'
import { PlayingStateManager } from './playingState'
import { ScanPlayingStateManager } from './scanPlayingState'
import { State, StateManager } from './state'

export class StandbyPlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.STANDBY_PLAYING)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.END_TURN) {
      this.context.currentTurnPlayerIndex =
        (this.context.currentTurnPlayerIndex + 1) %
        this.context.context.playerManager.players.length

      this.context.subPlayingStateManager = new DrawPlayingStateManager(
        this.context
      )
      this.context.context.actionManager.sendAction({
        agent: Agent.SYSTEM,
        type: ActionType.STATE_CHANGED,
        info: {
          from: this.state,
          to: State.DRAW_PLAYING,
        },
      })
    }

    if (action.type === ActionType.CHOOSE_ACTION) {
      this.context.subPlayingStateManager = new ScanPlayingStateManager(
        this.context
      )
      this.context.context.actionManager.sendAction({
        agent: Agent.SYSTEM,
        type: ActionType.STATE_CHANGED,
        info: {
          from: this.state,
          to: this.context.subPlayingStateManager.state,
        },
      })
    }
  }
}
