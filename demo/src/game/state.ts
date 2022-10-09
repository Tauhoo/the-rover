import { Action, ActionHandler } from './action'

export abstract class StateManager implements ActionHandler {
  state: State
  constructor(state: State) {
    this.state = state
  }

  abstract doAction(action: Action): void
}

export enum State {
  WAITING_PLAYER = 'WAITING_PLAYER',
  STANDBY = 'STANDBY',
  PLAYING = 'PLAYING',
  END = 'END',

  DRAW_PLAYING = 'DRAW_PLAYING',
  STANDBY_PLAYING = 'STANDBY_PLAYING',
  SCAN_PLAYING = 'SCAN_PLAYING',
  MOVE_PLAYING = 'MOVE_PLAYING',
}

export type StateTransition = {
  from: State
  to: State
}
