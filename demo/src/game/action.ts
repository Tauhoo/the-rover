export type Action = {
  type: ActionType
  info: any
}

export enum ActionType {
  ADD_PLAYER = 'ADD_PLAYER',
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
