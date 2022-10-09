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
  // playing -> draw
  DRAW_CARD = 'DRAW_CARD',
  // playing -> standby
  CHOOSE_ACTION = 'CHOOSE_ACTION',
  END_TURN = 'END_TURN',
  // playing -> scan
  SCAN = 'SCAN',
  // playing -> move
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
