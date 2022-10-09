const world = 'world'

export function hello(who: string = world): string {
  return `Hello i ${who}! `
}

console.log(hello())
