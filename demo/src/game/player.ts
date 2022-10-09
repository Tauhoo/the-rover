import { v4 as uuidv4 } from 'uuid'

export class Player {
  id: string
  name: string

  constructor(name: string) {
    this.name = name
    this.id = uuidv4()
  }
}

export class PlayerManager {
  players: Player[] = []
  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer)
  }
}
