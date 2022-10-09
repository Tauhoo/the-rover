import { ActionType, Agent } from './game/action'
import { Game } from './game/game'
import { Player } from './game/player'

const game = new Game()

game.actionManager.sendAction({
  type: ActionType.ADD_PLAYER,
  agent: Agent.PLAYER,
  info: new Player('ice'),
})

console.log(game.playerManager.players)
