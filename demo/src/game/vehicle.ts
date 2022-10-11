import Victer from 'victor'
import { AutoPart, AutoPartType, isConnectorsCompatible } from './autoPart'

export const requiredAutoPartTypes = [
  AutoPartType.ENGIN,
  AutoPartType.DRIVER,
  AutoPartType.ENERGY_SOURCE,
  AutoPartType.SKELETON,
]

class AutoPartLocation {
  autoPart: AutoPart
  position: Victer
  constructor(autoPart: AutoPart, position: Victer) {
    this.autoPart = autoPart
    this.position = position
  }
  canConnectWith(autoPartLocation: AutoPartLocation): boolean {
    const as = autoPartLocation.autoPart.connecters
    const bs = this.autoPart.connecters

    for (const a of as) {
      for (const b of bs) {
        if (
          isConnectorsCompatible(
            {
              connecter: a,
              offsetPosition: autoPartLocation.position,
            },
            {
              connecter: b,
              offsetPosition: this.position,
            }
          )
        )
          return true
      }
    }
    return false
  }
}

function isAutoPartLocationIntercept(
  a: AutoPartLocation,
  b: AutoPartLocation
): boolean {
  const aPositions = JSON.parse(
    JSON.stringify(a.autoPart.positions)
  ) as Victer[]
  const bPositions = JSON.parse(
    JSON.stringify(b.autoPart.positions)
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
  autoPartLocations: AutoPartLocation[]
  maxCapabilityPoint: number
}

export class Vehicle {
  requiredAutoPartTypes: AutoPartType[]
  autoPartLocations: AutoPartLocation[]
  maxCapabilityPoint: number
  constructor(options: VehicleOptions) {
    this.autoPartLocations = options.autoPartLocations
    this.requiredAutoPartTypes = options.requiredAutoPartTypes
    this.maxCapabilityPoint = options.maxCapabilityPoint
  }

  validateNewAutoPart(newAutoPartLocation: AutoPartLocation): boolean {
    // validate interception
    for (const autoPartLocation of this.autoPartLocations) {
      if (isAutoPartLocationIntercept(autoPartLocation, newAutoPartLocation))
        return false
    }

    // validate connecter compatability
    for (const autoPartLocation of this.autoPartLocations) {
      if (newAutoPartLocation.canConnectWith(autoPartLocation)) return true
    }

    return false
  }
}
