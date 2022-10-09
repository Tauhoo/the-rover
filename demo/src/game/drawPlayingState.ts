import { Action, ActionType, Agent } from './action'
import { Game } from './game'
import { PlayingStateManager } from './playingState'
import { StandbyPlayingStateManager } from './standbyPlayingState'
import { State, StateManager } from './state'

export class DrawPlayingStateManager extends StateManager {
  context: PlayingStateManager

  constructor(context: PlayingStateManager) {
    super(State.DRAW_PLAYING)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.DRAW_CARD) {
      this.context.subPlayingStateManager = new StandbyPlayingStateManager(
        this.context
      )
      this.context.context.actionManager.sendAction({
        agent: Agent.SYSTEM,
        type: ActionType.STATE_CHANGED,
        info: {
          from: this.state,
          to: State.STANDBY_PLAYING,
        },
      })
    }
  }
}
