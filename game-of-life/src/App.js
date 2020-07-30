import React, {useRef, useState, useEffect} from 'react';
import './App.css';
import styled from 'styled-components';

const Canvas = styled.canvas`
border: solid pink 2px;
width: 80%;
height: 60vh;
`;

const Gridcontainer = styled.div`
display: inline-grid;
border: solid pink 1px;
grid-template-columns: repeat(40, 2.5%);
`;

const Cell = styled.div`
height: 15px;
width: 15px;
border: dotted pink 1px
`;

let interval;

function App() {
  
  const colNums = 40;
  const rowNums = 40;

  const make2DArray = (cols, rows) => {
    let arr = new Array(rows);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(colNums).fill(0);
    };

    return arr
  };

  let grid = make2DArray(colNums, rowNums); 
  
  const [gridData, setGridData] = useState(grid);
  const [running, setRunning] = useState(false);
  const [gen, setGen] = useState(0)
  const [mode, setMode] = useState('TOGGLE');
  const gridRef = useRef();
  gridRef.current = gridData;

  const gridStep = () => {
    // [vertical, horizontal]
    // [0, 0] = top left
    // [0, 39] = top right
    // [39, 39] = bottom right
    // [39, 0] = bottom left
    setGen(g => g + 1)
    const operations = [
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1]
    ];

    let nextGrid = make2DArray(colNums, rowNums);
    // console.log('grid before step', gridRef.current)
    // console.log('next grid before operations are done', nextGrid)
    console.log('step')

    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 40; j++) {
        let neighbors = 0;

        operations.forEach(([vert, hori]) => {
          let newVert = i + vert;
          let newHori = j + hori;

          if (newVert >= 0 && newVert <= 39 && newHori >= 0 && newHori <= 39) {
            neighbors += gridRef.current[newVert][newHori]
            // nextGrid[newVert][newHori] = 1
          };
        });

        if (gridRef.current[i][j] === 1) {
          // if cell is alive already
          if (neighbors < 2 || neighbors > 3) {
            nextGrid[i][j] = 0
            // console.log('killed cell', i, j, neighbors)
          }else if (neighbors === 2 || neighbors === 3) {
            nextGrid[i][j] = 1
          }
        };

        if (gridRef.current[i][j] === 0 && neighbors === 3) {
          nextGrid[i][j] = 1
        };
      };
    };
    // console.log('old grid', gridRef.current)
    // console.log('new grid after ops', nextGrid)
    setGridData(nextGrid)
  };
  
  const startRender = () => {
    gridStep();
    interval = setInterval(gridStep, 200);
    console.log(`running from loop is ${running}`);
  };

  const start = () => {
    if (!running) {

      setRunning(true)
      startRender();
    };

  };

  const stop = () => {
    console.log(`stopping`)
    setRunning(false)
    clearInterval(interval)
  };

  const cellToggle = (i, j) => {

    if (running) {
      return;
    }
    const newGrid = [...gridRef.current];
    if (gridRef.current[i][j]) {
      // let split = e.target.className.split(' ');
      // e.target.className = `${split[0]} ${split[1]}`;
      newGrid[i][j] = 0;

    } else if (!gridRef.current[i][j]) {
      // e.target.className = `${e.target.className} ${'filled'}`;
      newGrid[i][j] = 1;
    };

    setGridData(newGrid)
    console.table(newGrid)
    console.log(i, j, 'val:', newGrid[i][j])
    console.log(newGrid[i])

  };

  const fill = (i, j) => {
    let fillGrid = [...gridData];

    const operations = [
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1]
    ];

    operations.forEach(([vert, hori]) => {
      let newVert = i + vert;
      let newHori = j + hori;

      if (newVert >= 0 && newVert <= 39 && newHori >= 0 && newHori <= 39) {
        // neighbors += gridRef.current[newVert][newHori]
        // nextGrid[newVert][newHori] = 1
        fillGrid[newVert][newHori] = 1
      };
    });
    setGridData(fillGrid)
  };

  const clearGrid = () => {
    stop();
    setGridData(grid)
    setGen(0)
  };

  const randomFill = () => {
    const randomGrid = make2DArray(colNums, rowNums);
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 40; j++) {
        let num = Math.random()
        if (num > 0.75) {
          randomGrid[i][j] = 1
        }
      };
    };
    setGridData(randomGrid);
    setGen(0)
  };

  const glider = (i, j) => {
    let gliderGrid = [...gridData];

    const gliderOps = [
      [0, 1],
      [-1, 0],
      [1, -1],
      [1, 0],
      [1, 1]
    ];

    gliderOps.forEach(([x, y]) => {
      let newX = i + x;
      let newY = j + y;

      if (newX >= 0 && newX <= 39 && newY >= 0 && newY <= 39) {
        gliderGrid[newX][newY] = 1;
      };

    });

    setGridData(gliderGrid)
  };

  const exploder = (i, j) => {
    let exploderGrid = [...gridData];

    const exploderOps = [
      [-2, -2],
      [0, -2],
      [2, -2],
      [-2, -1],
      [2, -1],
      [-2, 0],
      [2, 0],
      [-2, 1],
      [2, 1],
      [0, 2],
      [2, 2],
      [-2, 2],
    ];

    exploderOps.forEach(([x, y]) => {
      let newX = x + i;
      let newY = y + j;

      if (newX >= 0 && newX <= 39 && newY >= 0 && newY <= 39) {
        exploderGrid[newX][newY] = 1;
      };
    });

    setGridData(exploderGrid);
  };

  const modeHandler = (i, j) => {
    switch (mode) {

      case 'TOGGLE':
        return cellToggle(i, j);
    
      case 'BORDER_FILL':
        return fill(i, j);

      case 'GLIDER':
        return glider(i, j);

      case 'EXPLODER':
        return exploder(i, j);

      default:
        break;
    }
  };


  return (
    <div className="App">

      <h1>
        John Conway's Game of Life
      </h1>
      <div className = 'flexRow'>
        <div className = 'gameContainer'>

          <div className = 'gameGrid'>

            <Gridcontainer>
              {gridData.map((item, i) => {
                return item.map((subItem, j) => {
                  return <Cell className = {subItem ? 'filled' : undefined} onClick = {(e) => modeHandler(i, j)}>
                  </Cell>
                })
              })}
            </Gridcontainer>

          </div>
          <div className = 'flexRow'>

          <div className = 'controls'>
            <p>
              {`Generation: ${gen}`}
            </p>
            <button onClick = {start}>
              Start
            </button>
            <button onClick = {stop}>
              Stop
            </button>
            <button onClick = {gridStep}>
              Step
            </button>
            <button onClick = {clearGrid}>
              Clear
            </button>
            <button onClick = {randomFill}>
              Random
            </button>
          </div>
          <div className = 'controls fills'>
            <p>
              Fill Mode: {`${mode}`}
            </p>
            <button onClick = {() => {setMode('TOGGLE')}}>
              Toggle
            </button>
            <button onClick = {() => {setMode('BORDER_FILL')}}>
              Border Fill
            </button>
            <button onClick = {() => {setMode('GLIDER')}}>
              Glider
            </button>
            <button onClick = {() => {setMode('EXPLODER')}}>
              Exploder
            </button>
          </div>
          </div>
        </div>
        <div className = 'info'>
          <div className = 'about'>
            <h3>
              About
            </h3>
            <p>
              John Conway's Game of Life is an example of a <a href = 'https://www.conwaylife.com/wiki/Cellular_automaton'>cellular automaton. </a> 
              Cells displayed on the grid can either be alive or dead, and are influenced by their <a href = 'https://en.wikipedia.org/wiki/Moore_neighborhood'>neighborhood,</a> or the cells surrounding them. 
              The way in which they are influenced is described by a set of rules, producing a new set of data, or generation, to be displayed.
            </p>
            <p>
              The game is a <a href = 'https://en.wikipedia.org/wiki/Zero-player_game'>zero-player game,</a> so all that the "player" has to do is set the initial state, and watch as the patterns evolve according to the rules of life.
            </p>
            <p>
              In this simulation, we're holding two datasets: the current grid, and the next grid to be displayed. The next grid comes from performing checks on every single cell in the current grid to decide if it will be alive or dead in the next iteration, and the old grid is then swapped with the new grid as we step through the generations.
              <br/>The edges of the grid are treated as permanently dead cells, and do not wrap around to the other side of the grid. If you want your cells to stay alive, try to keep things closer to the middle.
            </p>
          </div>
          <div className = 'rules'>

            <h3>
            Rules
            </h3>

            <li>If a live cell has less than 2 or more than 3 neighbors, it dies.</li>
            <li>If a live cell has 2 or 3 neighbors, it lives on to the next generation.</li>
            <li>If a dead cell has 3 live neighbors, it will be brought to life.</li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;