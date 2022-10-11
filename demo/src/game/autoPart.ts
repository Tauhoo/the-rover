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
  direction: Victer
  position: Victer
}

export type AutoPartOption = {
  type: AutoPartType
  ability: AutoPartAbility
  positions: Victer[]
  connecters: AutoPartConnector[]
}

export abstract class AutoPart {
  type: AutoPartType
  ability: AutoPartAbility
  positions: Victer[]
  connecters: AutoPartConnector[]
  constructor(options: AutoPartOption) {
    this.type = options.type
    this.ability = options.ability
    this.positions = options.positions
    this.connecters = options.connecters
  }
}

export type AutoPartConnectorLocation = {
  connecter: AutoPartConnector
  offsetPosition: Victer
}

export function isConnectorsCompatible(
  a: AutoPartConnectorLocation,
  b: AutoPartConnectorLocation
): boolean {
  // position
  const aPosition = a.connecter.position.clone().add(a.offsetPosition)
  const bPosition = b.connecter.position.clone().add(b.offsetPosition)
  const directionalPath = bPosition.subtract(aPosition)
  const directionalPathLength =
    Math.abs(directionalPath.x) + Math.abs(directionalPath.y)
  if (directionalPathLength !== 1) {
    return false
  }

  // direction
  const calculateDirectionCollision = a.connecter.direction
    .clone()
    .add(a.connecter.direction)
  if (
    calculateDirectionCollision.x !== 0 ||
    calculateDirectionCollision.y !== 0
  ) {
    return false
  }

  return true
}
