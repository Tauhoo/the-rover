import { ActionType } from './game/action'
import { Game } from './game/game'

const game = new Game()

game.actionManager.sendAction({
  type: ActionType.ADD_PLAYER,
  info: {
    name: 'ice',
  },
})

console.log(game.playerManager.players)
