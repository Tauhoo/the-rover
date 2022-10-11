import { defaultAutoPartLocations } from './autoPartList'
import { Card } from './card'
import { Player } from './player'
import { requiredAutoPartTypes, Vehicle } from './vehicle'

export type PlayerGameInfoOptions = {
  player: Player
  vehicle: Vehicle
  cards: Card[]
}

export class PlayerGameInfo {
  player: Player
  vehicle: Vehicle
  cards: Card[]

  constructor(options: PlayerGameInfoOptions) {
    this.player = options.player
    this.vehicle = options.vehicle
    this.cards = options.cards
  }
}

export function NewDefaultPlayerGameInfo(player: Player): PlayerGameInfo {
  return new PlayerGameInfo({
    player: player,
    vehicle: new Vehicle({
      autoPartLocations: defaultAutoPartLocations,
      requiredAutoPartTypes: requiredAutoPartTypes,
      maxCapabilityPoint: 10,
    }),
    cards: [],
  })
}
