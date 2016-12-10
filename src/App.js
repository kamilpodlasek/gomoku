import React, { Component } from 'react';
import Board from './Board';

class App extends Component {
  constructor() {
    super();
    const startFieldSize = 22;
    const margin = 1;
    const {maxHeight, maxWidth} = this.calculateStartFields(startFieldSize + 2 * margin);
    const startFieldsHeight = maxHeight * startFieldSize + 2 * maxHeight;
    const startFieldWidth = maxWidth * startFieldSize + 2 * maxWidth;
    const fieldsBg = [];
    for(let i = 0; i < maxHeight; i++) {
      fieldsBg[i] = [];
      for(let j = 0; j < maxWidth; j++) {
        fieldsBg[i][j] = Math.floor((Math.random() * 5));
      }
    }

    this.state = {
      height: maxHeight,
      width: maxWidth,
      maxHeight: maxHeight,
      maxWidth: maxWidth,
      fieldSize: startFieldSize,
      maxBoardHeight: startFieldsHeight + 4,//+ boardInner padding
      maxBoardWidth: startFieldWidth + 4,
      boardHeight: startFieldsHeight + 4,
      boardWidth: startFieldWidth + 4,
      boardScrollTop: 0,
      boardScrollLeft: 0,
      fieldsHeight: startFieldsHeight,
      fieldsWidth: startFieldWidth,
      minRow: 5,
      turn: 'x',
      move: 0,
      winner: null,
      fields: [Array(maxHeight).fill(null).map(() => Array(maxWidth).fill(null))],
      fieldsBg: [fieldsBg],
      winnerFields: null
    }

    this.announceWinner = this.announceWinner.bind(this);
    this.changeFieldSize = this.changeFieldSize.bind(this);
    this.changeMove = this.changeMove.bind(this);
    this.changeMinRow = this.changeMinRow.bind(this);
    this.changeBoardSize = this.changeBoardSize.bind(this);
  }

  calculateStartFields(fieldSize) {
    let y = parseInt(window.innerHeight / fieldSize, 10) - 3;
    let x = parseInt(window.innerWidth / fieldSize, 10) - 2;

    if(y > 50) {
      y = 50;
    } else if(y < 5) {
      y = 5;
    }
    if(x > 50) {
      x = 50;
    } else if(x < 5) {
      x = 5;
    }

    return {maxHeight: y, maxWidth: x}
  }

  changeFieldSize(event) {
    let fieldSize = parseInt(event.target.value, 10);
    if(fieldSize < 5) {
      fieldSize = 5;
    } else if(fieldSize > 50) {
      fieldSize = 50;
    }

    this.setState({
      fieldSize: fieldSize
    }, () => {//callback
      this.countDimensions();
    });
  }

  changeMove(event) {
    let move;
    if(event.target.value === "<") {//button <
      move = this.state.move - 1;
    } else if(event.target.value === ">") {//button <
      move = this.state.move + 1;
    } else {//number input
      move = parseInt(event.target.value, 10) - 1;
    }

    if(move < 0) {
      move = 0;
    } else if(move > this.state.fields.length - 1) {
      move = this.state.fields.length - 1;
    }

    this.setState({
      move: move,
      turn: (move % 2 === 0) ? 'x' : 'o',
      winner: null
    });
  }

  changeMinRow(event) {
    let minRow = parseInt(event.target.value, 10);
    if(minRow < 3) {
      minRow = 3;
    }

    this.setState({
      minRow: minRow
    });
  }

  handleClick(y, x) {
    if(!this.state.winner) {
      if(this.changeField(y, x)) {
        this.setState({
          move: this.state.move + 1,
          turn: ((this.state.move + 1) % 2 === 0) ? 'x' : 'o'
        });
      }
    }
  }

  announceWinner(winner) {
    this.setState({
      winner: winner
    });
  }

  changeField(y, x) {
    if(this.state.fields[this.state.move][y][x] === null) {//if field is empty
      let fields = this.state.fields.slice(0, this.state.move + 1);
      let field = fields[this.state.move].map(function(arr) {//copy of state.fields
        return arr.slice();
      });

      field[y][x] = this.state.turn;//set new field value
      fields.push(field);

      this.setState({//set updated fields as a state
        fields: fields
      }, () => {//callback
        this.checkField(y, x)//check if there is a winner
      });

      return true;//there was a change
    } else {
      return false;//there was no change
    }
  }

  checkField(yNew, xNew) {
    const fields = this.state.fields[this.state.move];
    let fieldsInRow = 1;
    let winnerFields = [{ y: yNew, x: xNew }];//array containing winning fields
    const checkRow = () => {
      if(fieldsInRow >= this.state.minRow) {
        this.announceWinner(fields[yNew][xNew]);
        this.setState({
          winnerFields: winnerFields
        });
        return true;
      } else {//values reset
        fieldsInRow = 1;
        winnerFields = [{ y: yNew, x: xNew }];
        return false;
      }
    }

    //VERTICAL
    let y = yNew - 1;
    while(y >= 0) {
      if(fields[y][xNew] === fields[yNew][xNew]) {
        winnerFields.push({ y: y, x: xNew });
        fieldsInRow++; y--;
      } else { break; }
    }
    y = yNew + 1;
    while(y < this.state.height) {
      if(fields[y][xNew] === fields[yNew][xNew]) {
        winnerFields.push({ y: y, x: xNew });
        fieldsInRow++; y++;
      } else { break; }
    }
    if(checkRow()) {
      return true;
    }

    //HORIZONTAL
    let x = xNew - 1;
    while(x >= 0) {
      if(fields[yNew][x] === fields[yNew][xNew]) {
        winnerFields.push({ y: yNew, x: x });
        fieldsInRow++; x--;
      } else { break; }
    }
    x = xNew + 1;
    while(x < this.state.width) {
      if(fields[yNew][x] === fields[yNew][xNew]) {
        winnerFields.push({ y: yNew, x: x });
        fieldsInRow++; x++;
      } else { break; }
    }
    if(checkRow()) {
      return true;
    }

    //DIAGONAL \
    x = xNew - 1; y = yNew - 1;
    while(x >= 0 && y >= 0) {
      if(fields[y][x] === fields[yNew][xNew]) {
        winnerFields.push({ y: y, x: x });
        fieldsInRow++; x--; y--;
      } else { break; }
    }
    x = xNew + 1; y = yNew + 1;
    while(x < this.state.width && y < this.state.height) {
      if(fields[y][x] === fields[yNew][xNew]) {
        winnerFields.push({ y: y, x: x });
        fieldsInRow++; x++; y++;
      } else { break; }
    }
    if(checkRow()) {
      return true;
    }

    //DIAGONAL /
    x = xNew - 1; y = yNew + 1;
    while(x >= 0 && y < this.state.height) {
      if(fields[y][x] === fields[yNew][xNew]) {
        winnerFields.push({ y: y, x: x });
        fieldsInRow++; x--; y++;
      } else { break; }
    }
    x = xNew + 1; y = yNew - 1;
    while(x < this.state.width && y >= 0) {
      if(fields[y][x] === fields[yNew][xNew]) {
        winnerFields.push({ y: y, x: x });
        fieldsInRow++; x++; y--;
      } else { break; }
    }
    if(checkRow()) {
      return true;
    }
  }

  changeBoardSize(event) {
    let valueCorrect = true;
    let value = parseInt(event.target.value, 10);
    if(value < 5 || isNaN(value)) {
      valueCorrect = false;
    } else if(value > 50) {
      value = 50;
    }

    event.target.className = valueCorrect ? "" : "error";

    let height, width;
    if(event.target.name === "height") {
      height = value;
      width = this.state.width;
    } else {
      height = this.state.height;
      width = value;
    }

    //change fields array's size
    let fieldsArray = this.state.fields.map(function(fields) {//copy of state.fields
      let difference = 0;
      if(fields.length !== height) {
        difference = fields.length - height;
        if(difference > 0) {
          while(difference > 0) {
            fields.pop();
            difference--;
          }
        } else if(difference < 0) {
          while(difference < 0) {
            fields.push(Array(width).fill(null));
            difference++;
          }
        }
      } else if(fields[0].length !== width) {
        difference = fields[0].length - width;
        if(difference > 0) {
          while(difference > 0) {
            for(let row of fields) {
              row.pop();
            }
            difference--;
          }
        } else if(difference < 0) {
          while(difference < 0) {
            for(let row of fields) {
              row.push(null);
            }
            difference++;
          }
        }
      }
      
      return fields;
    });

    //change fieldsBg array's size
    let fieldsBgArray = this.state.fieldsBg.map(function(fields) {//copy of state.fields
      let difference = 0;
      if(fields.length !== height) {
        difference = fields.length - height;
        if(difference > 0) {
          while(difference > 0) {
            fields.pop();
            difference--;
          }
        } else if(difference < 0) {
          while(difference < 0) {
            let fieldsArr = [];
            for(let i = 0; i < width; i++) {
              fieldsArr[i] = Math.floor((Math.random() * 5));
            }
            fields.push(fieldsArr);
            difference++;
          }
        }
      } else if(fields[0].length !== width) {
        difference = fields[0].length - width;
        if(difference > 0) {
          while(difference > 0) {
            for(let row of fields) {
              row.pop();
            }
            difference--;
          }
        } else if(difference < 0) {
          while(difference < 0) {
            for(let row of fields) {
              row.push(Math.floor((Math.random() * 5)));
            }
            difference++;
          }
        }
      }
      
      return fields;
    });

    this.setState({
      [event.target.name]: value,
      fields: fieldsArray,//set updated fields as a state
      fieldsBg: fieldsBgArray//set updated fieldsBg as a state
    }, () => {//callback
      this.countDimensions();
    });
  }

  countDimensions() {
    let boardHeight, boardWidth, boardScrollTop = 0, boardScrollLeft = 0;
    const fieldsHeight = this.state.height * this.state.fieldSize + 2 * this.state.height;
    const fieldsWidth = this.state.width * this.state.fieldSize + 2 * this.state.width;

    if(this.state.height > this.state.maxHeight) {
      boardHeight = this.state.maxHeight * this.state.fieldSize + 2 * this.state.maxHeight;
      boardScrollTop = (fieldsHeight - boardHeight) / 2;
    } else {
      boardHeight = fieldsHeight > this.state.maxBoardHeight ? this.state.maxBoardHeight : fieldsHeight;
    }
    if(this.state.width > this.state.maxWidth) {
      boardWidth = this.state.maxWidth * this.state.fieldSize + 2 * this.state.maxWidth;
      boardScrollLeft = (fieldsWidth - boardWidth) / 2;
    } else {
      boardWidth = fieldsWidth > this.state.maxBoardWidth ? this.state.maxBoardWidth : fieldsWidth;
    }

    console.log(boardHeight, this.state.maxBoardHeight);

    this.setState({
      boardWidth: boardWidth + 4,//+ boardInner padding
      boardHeight: boardHeight + 4,
      boardScrollLeft: boardScrollLeft,
      boardScrollTop: boardScrollTop,
      fieldsHeigth: fieldsHeight,
      fieldsWidth: fieldsWidth
    });
  }

  render() {
    return (
      <div>
        <header>
          <div className="logo">
            <b>Gomoku</b>
          </div>
          <div className="settings">
            <span>Height:<input type="number" name="height" value={this.state.height} min="5" max="50" onChange={this.changeBoardSize}/></span>
            <span>Width:<input type="number" name="width" value={this.state.width} min="5" max="50" onChange={this.changeBoardSize}/></span>
            <span>Field size:<input type="number" value={this.state.fieldSize} min="5" max="50" onChange={this.changeFieldSize}/></span>
            <span>Row length:<input type="number" value={this.state.minRow} min="3" onChange={this.changeMinRow}/></span>
          </div>
          <div className="move">
            <span>Move:<input type="number" value={this.state.move + 1} min="1" onChange={this.changeMove}/>
            <input type="button" value="<" onClick={this.changeMove}/>
            <input type="button" value=">" onClick={this.changeMove}/></span>
            {this.state.winner ? <span>The winner is: <b>{this.state.winner}</b></span> : <span>Turn: <b>{this.state.turn.toUpperCase()}</b></span>}
          </div>
        </header>
        <Board
          width={this.state.width}
          height={this.state.height}
          maxWidth={this.state.maxWidth}
          maxHeight={this.state.maxHeight}
          boardHeight={this.state.boardHeight}
          boardWidth={this.state.boardWidth}
          boardScrollTop={this.state.boardScrollTop}
          boardScrollLeft={this.state.boardScrollLeft}
          fieldsHeigth={this.state.fieldsHeigth}
          fieldsWidth={this.state.fieldsWidth}
          onClick={(y, x) => this.handleClick(y, x)}
          fieldSize={this.state.fieldSize}
          fields={this.state.fields[this.state.move]}
          fieldsBg={this.state.fieldsBg[0]}
          winnerFields={this.state.winner ? this.state.winnerFields : null}/>
      </div>
    );
  }
}

export default App;