# The Rover

This repository contain the materials and my work on a game design project named The Rover. The goal of this project is for I, GAME & ROBOT hackathon on Gitcoin. I participant in 3 topic Game Feature Design, Game Design Planning, and Concept Art Design. So, you can explore the results of them here. Enjoy ❤

## Game Type

---

It's a board game-like game. Each player takes their turn and does some action with their card to make an advantage. it's also generative content game. So, it is replayable.

## Theme

---

It's in the far future. Aliens can be seen every where in this universe. But, In this era, the energy is shortage. After, many researching and exploration, Graxium is found. it's the most energetic ore and can solve the energy lacking problem. But, collecting them is really hard due to the bad terrain of thier inhabitant. So, there are people called The Rover. They have responsibility to find the Graxium and sell it to the energy management organization of the universe. But, Graxium in each planet isn't unlimit. So, The Rovers need to compate to each others for it. Moreover, because of the terrain and the environment in each planet, they need to custom thier vehicle so it can adapt and survive.

In this game, you will play as one of The Rovers. You need to find as much Graxium as possible in each planet. But, the more dangerous planet the more amount of Graxium available. If you want to find much Graxium, you need to upgrade your auto parts and other tools. So, you can survive in planets and can fight with others.

## In-game Mechanism

---

Goal of the game is to find Graxium in the planet and extract it.

## Standby state

This is the first state in game. User will know how the planet environment is. So, user can plan how to play it in this match. After the planet info is review, play will get starter card in thier hand.

And, user can set up thier car with thier prepare card.

## Playing state

In this state, player will take thier turn and do actions. Actions are devided into 3 type.

1. Scan the terrain (Can implement Minesweeper-like logic).
2. Use some action card such as shoot missile or teleport.
3. Move the car (Depend on speed and environment). This move will reduce player's energy too.

If the player found the hord of the Graxium, player need to protect it from the others player.

## End-game state

If a player can extract Graxium successfully, the game will end. And, the winner is the extracter.

## Out-game Mechanism

If you win a match making, you will get some money from the game. The amount of money is depend on your match's rank. The higher rank you are, you will encounter the more dangerous planet and the more strong player in matchs.
