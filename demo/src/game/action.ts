export type Action = {
  agent: Agent
  type: ActionType
  info: any
}

export enum Agent {
  SYSTEM = 'SYSTEM',
  PLAYER = 'PLAYER',
}

export enum ActionType {
  STATE_CHANGED = 'STATE_CHANGED',
  // waiting player
  ADD_PLAYER = 'ADD_PLAYER',
  START_GAME = 'START_GAME',

  NEW_PLAYER_IS_ADDED = 'NEW_PLAYER_IS_ADDED',
  // standby
  PLAYER_IS_READY = 'PLAYER_IS_READY',
  // playing
  //  -> draw
  DRAW_CARD = 'DRAW_CARD',
  //  -> standby
  CHOOSE_ACTION = 'CHOOSE_ACTION',
  END_TURN = 'END_TURN',
  //  -> scan
  SCAN = 'SCAN',
  //  -> move
  MOVE_VEHICLE = 'MOVE_VEHICLE',
}

type ActionListener = (action: Action) => void

export class ActionManager {
  listeners: ActionListener[] = []

  registerListener(actionListener: ActionListener) {
    this.listeners.push(actionListener)
  }

  sendAction(action: Action) {
    for (const listener of this.listeners) {
      listener(action)
    }
  }
}

export interface ActionHandler {
  doAction(action: Action): void
}
