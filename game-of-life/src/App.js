import React, {useRef, useState, useEffect} from 'react';
import logo from './logo.svg';
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
// border: solid pink 1px
`;

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
  const runningRef = useRef();
  runningRef.current = running;
  const gridRef = useRef();
  gridRef.current = gridData;



  const clearGrid = () => {
    setGridData(grid)
  }

  const cellToggle = (e, i, j) => {
    const newGrid = [...gridRef.current];
    if (gridRef.current[i][j]) {
      let split = e.target.className.split(' ');
      e.target.className = `${split[0]} ${split[1]}`;
      newGrid[i][j] = 0;

    } else if (!gridRef.current[i][j]) {
      e.target.className = `${e.target.className} ${'filled'}`;
      newGrid[i][j] = 1;
    };

    setGridData(newGrid)
    console.table(newGrid)
    console.log(i, j, 'val:', newGrid[i][j])
    console.log(newGrid[i])

  };


  const gridStep = () => {
    // [vertical, horizontal]
    // [0, 0] = top left
    // [0, 39] = top right
    // [39, 39] = bottom right
    // [39, 0] = bottom left

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
            console.log('killed cell', i, j, neighbors)
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

  let interval;

  const startRender = () => {
    // gridStep();
    interval = setInterval(gridStep, 500)
  }

  const toggleStart = () => {
    console.log('togglestart')
    if (running) {
      console.log('stopping')
      setRunning(false)
      clearInterval(interval)
    } else if (!runningRef.current) {
      console.log('starting')
      setRunning(true)
      startRender();
    }
  }

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
  }


  return (
    <div className="App">
      <p>
        Conway's Game of Life
      </p>
      <Gridcontainer>
        {gridData.map((item, i) => {
          return item.map((subItem, j) => {
            // return <Cell className = {subItem ? 'filled' : undefined} onClick = {(e) => fill(i, j)}>
            return <Cell className = {subItem ? 'filled' : undefined} onClick = {(e) => cellToggle(e, i, j)}>
            {/* {subItem ? subItem : 0} */}
            </Cell>
          })
        })}
      </Gridcontainer>
      <div>
        <button onClick = {toggleStart}>
          {running ? 'Stop' : 'Start'}
        </button>
        <button onClick = {gridStep}>
          Step
        </button>
        <button onClick = {clearGrid}>
          Clear
        </button>
        <button onClick = {() => {console.log(gridData)}}>
          log
        </button>
      </div>
    </div>
  );
}

export default App;
