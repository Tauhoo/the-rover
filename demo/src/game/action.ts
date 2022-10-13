export type Action = {
  type: ActionType
  info: any
}

export enum ActionType {
  // waiting player
  ADD_PLAYER = 'ADD_PLAYER',
  START_GAME = 'START_GAME',
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

export enum PlayingActionType {
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
