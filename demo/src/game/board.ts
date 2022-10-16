import Victer from 'victor'

export type BoardOptions = {
  height: number
  width: number
}

export class Board {
  options: BoardOptions
  tileSet: Tile[][]
  graxiumPosition: Victer

  constructor(options: BoardOptions) {
    this.options = options
    this.tileSet = generateTileSet(
      options.height,
      options.width,
      new RandomTileGenerator()
    )

    const x = Math.floor(Math.random() * options.width)
    const y = Math.floor(Math.random() * options.height)
    this.graxiumPosition = new Victer(x, y)
    console.log(`Graxium position: (${x},${y})`)
  }

  getTileByPosition(position: Victer): Tile {
    return this.tileSet[position.y][position.x]
  }
}

interface TileGenerator {
  generate(position: Victer): Tile
}

class RandomTileGenerator {
  generate(position: Victer): Tile {
    return new Tile()
  }
}

function generateTileSet(
  height: number,
  width: number,
  generator: TileGenerator
): Tile[][] {
  const tileSet: Tile[][] = []
  for (let hindex = 0; hindex < height; hindex++) {
    const tileRow = []
    for (let windex = 0; windex < width; windex++) {
      tileRow.push(generator.generate(new Victer(windex, hindex)))
    }
    tileSet.push(tileRow)
  }
  return tileSet
}

export class Tile {}
