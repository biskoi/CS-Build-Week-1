# Deploy
Check out the live app here: https://biskoi.github.io/CS-Build-Week-1/

# About
John Conway's Game of Life is an example of a cellular automaton.Cells displayed on the grid can either be alive or dead, and are influenced by their neighborhood, or the cells surrounding them. The way in which they are influenced is described by a set of rules, producing a new set of data, or generation, to be displayed.

The game is a zero-player game, so all that the "player" has to do is set the initial state, and watch as the patterns evolve according to the rules of life.

In this simulation, we're holding two datasets: the current grid, and the next grid to be displayed. The next grid comes from performing checks on every single cell in the current grid to decide if it will be alive or dead in the next iteration, and the old grid is then swapped with the new grid as we step through the generations.
The edges of the grid are treated as permanently dead cells, and do not wrap around to the other side of the grid. If you want your cells to stay alive, try to keep things closer to the middle.

#Rules
If a live cell has less than 2 or more than 3 neighbors, it dies.
If a live cell has 2 or 3 neighbors, it lives on to the next generation.
If a dead cell has 3 live neighbors, it will be brought to life.
