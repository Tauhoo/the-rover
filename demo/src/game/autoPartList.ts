import Victer from 'victor'
import { AutoPart, AutoPartType } from './autoPart'
import { AutoPartLocation } from './vehicle'

class DefaultEngineAbility {}
class DefaultEngine extends AutoPart {
  constructor() {
    super({
      type: AutoPartType.ENGIN,
      ability: new DefaultEngineAbility(),
      positions: [],
      connecters: [],
    })
  }
}

class DefaultDriverAbility {}
class DefaultDriver extends AutoPart {
  constructor() {
    super({
      type: AutoPartType.DRIVER,
      ability: new DefaultDriverAbility(),
      positions: [],
      connecters: [],
    })
  }
}

class DefaultEnergySourceAbility {}
class DefaultEnergySource extends AutoPart {
  constructor() {
    super({
      type: AutoPartType.ENERGY_SOURCE,
      ability: new DefaultEnergySourceAbility(),
      positions: [],
      connecters: [],
    })
  }
}

class DefaultSkeletonSourceAbility {}
class DefaultSkeletonSource extends AutoPart {
  constructor() {
    super({
      type: AutoPartType.SKELETON,
      ability: new DefaultSkeletonSourceAbility(),
      positions: [],
      connecters: [],
    })
  }
}

export const defaultAutoPartLocations: AutoPartLocation[] = [
  new AutoPartLocation(new DefaultDriver(), new Victer(0, 0)),
]
