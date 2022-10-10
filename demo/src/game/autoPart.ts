import Victer from 'victor'

export enum AutoPartType {
  ENGIN = 'ENGIN',
  DRIVER = 'DRIVER',
  ENERGY_SOURCE = 'ENERGY_SOURCE',
  SKELETON = 'SKELETON',
  PERIPHERAL = 'PERIPHERAL',
}

export interface AutoPartAbility {}

export type AutoPartConnector = {
  direction: Victer[]
  toType: AutoPartType
}

export type AutoPartOption = {
  ability: AutoPartAbility
  positions: Victer[]
  connecter: AutoPartConnector[]
}

export abstract class AutoPart {
  options: AutoPartOption
  constructor(options: AutoPartOption) {
    this.options = options
  }
}
