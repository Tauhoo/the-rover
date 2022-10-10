import Victer from 'victor'
import { AutoPart, AutoPartType } from './autoPart'

export const requiredAutoPartTypes = [
  AutoPartType.ENGIN,
  AutoPartType.DRIVER,
  AutoPartType.ENERGY_SOURCE,
  AutoPartType.SKELETON,
]

type AutoPartNode = {
  autoPart: AutoPart
  position: Victer
}

function isAutoPartNodeIntercept(a: AutoPartNode, b: AutoPartNode): boolean {
  const aPositions = JSON.parse(
    JSON.stringify(a.autoPart.options.positions)
  ) as Victer[]
  const bPositions = JSON.parse(
    JSON.stringify(b.autoPart.options.positions)
  ) as Victer[]

  const positionMap = new Map<number, number[]>()

  for (const position of [...aPositions, ...bPositions]) {
    if (!positionMap.has(position.x)) positionMap.set(position.x, [position.y])
    if (positionMap.get(position.x)?.includes(position.y)) return true
  }

  return false
}

type VehicleOptions = {
  requiredAutoPartTypes: AutoPartType[]
  autoPartNodes: AutoPartNode[]
  maxCapabilityPoint: number
}

export class Vehicle {
  requiredAutoPartTypes: AutoPartType[]
  autoPartNodes: AutoPartNode[]
  maxCapabilityPoint: number
  constructor(options: VehicleOptions) {
    this.autoPartNodes = options.autoPartNodes
    this.requiredAutoPartTypes = options.requiredAutoPartTypes
    this.maxCapabilityPoint = options.maxCapabilityPoint
  }

  validateNewAutoPart(newAutoPartNode: AutoPartNode) {
    // validate interception
    for (const autoPartNode of this.autoPartNodes) {
      if (isAutoPartNodeIntercept(autoPartNode, newAutoPartNode)) return false
    }

    // validate connecter compatability
  }
}
