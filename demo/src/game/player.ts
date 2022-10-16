import { v4 as uuidv4 } from 'uuid'

export class Player {
  id: string
  name: string
  color: string

  constructor(name: string) {
    this.name = name
    this.id = uuidv4()
    this.color = Math.floor(Math.random() * 16777215).toString(16)
  }
}

export class PlayerManager {
  players: Player[] = []
  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer)
  }
  getPlayerByID(id: string): Player | null {
    const players = this.players.filter(p => p.id === id)
    if (players.length !== 1) {
      return null
    } else {
      return players[0]
    }
  }
}
