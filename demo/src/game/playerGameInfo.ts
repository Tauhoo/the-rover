import Victer from 'victor'
import { defaultAutoPartLocations } from './autoPartList'
import { Card } from './card'
import { Player } from './player'
import { ScanResult } from './scanPlayingState'
import { requiredAutoPartTypes, Vehicle } from './vehicle'

export type ScanRecord = {
  position: Victer
  result: ScanResult
}

export type PlayerGameInfoOptions = {
  player: Player
  vehicle: Vehicle
  cards: Card[]
  position: Victer
}

export class PlayerGameInfo {
  player: Player
  vehicle: Vehicle
  cards: Card[]
  position: Victer
  scanRecords: ScanRecord[]

  constructor(options: PlayerGameInfoOptions) {
    this.player = options.player
    this.vehicle = options.vehicle
    this.cards = options.cards
    this.position = options.position
    this.scanRecords = []
  }

  addScanRecord(record: ScanRecord) {
    this.scanRecords.push(record)
  }

  addScanRecordAtCurrentPosition(result: ScanResult) {
    this.scanRecords.push({ position: this.position, result: result })
  }
}

export function NewDefaultPlayerGameInfo(
  player: Player,
  position: Victer
): PlayerGameInfo {
  return new PlayerGameInfo({
    player: player,
    vehicle: new Vehicle({
      autoPartLocations: defaultAutoPartLocations,
      requiredAutoPartTypes: requiredAutoPartTypes,
      maxCapabilityPoint: 10,
    }),
    position: position,
    cards: [],
  })
}
