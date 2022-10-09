import { Action, ActionType, Agent } from './action'
import { Game } from './game'
import { Player } from './player'
import { StandbyStateManager } from './standbyState'
import { State, StateManager } from './state'

export class WaitingStateManager extends StateManager {
  context: Game
  constructor(context: Game) {
    super(State.WAITING_PLAYER)
    this.context = context
  }

  doAction(action: Action): void {
    if (action.type === ActionType.ADD_PLAYER) {
      const newPlayer: Player = action.info
      this.context.playerManager.addPlayer(newPlayer)
      this.context.actionManager.sendAction({
        agent: Agent.SYSTEM,
        type: ActionType.NEW_PLAYER_IS_ADDED,
        info: newPlayer,
      })
    }

    if (action.type === ActionType.START_GAME) {
      if (this.context.playerManager.players.length === 0) return
      this.context.stateManager = new StandbyStateManager(this.context)
      this.context.actionManager.sendAction({
        agent: Agent.SYSTEM,
        type: ActionType.STATE_CHANGED,
        info: {
          from: this.state,
          to: State.STANDBY,
        },
      })
    }
  }
}
