import React from 'react';
//import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import Field from './Field';

class Board extends React.Component {
  isHighlighted(y, x) {
    return this.props.winnerFields.some((obj) => {
      return (obj.y === y && obj.x === x);
    });
  }

  render() {
    let display = (this.props.height && this.props.width) ? "inline-block" : "none";
    let board = [];
    for(let y = 0; y < this.props.height; y++) {
      for(let x = 0; x < this.props.width; x++) {  
        board.push(<Field key={y+"_"+x}
                          highlight={this.props.winnerFields ? this.isHighlighted(y, x) : false}
                          value={this.props.fields[y][x]}
                          fieldSize={this.props.fieldSize}
                          bgNum={this.props.fieldsBg[y][x]}
                          onClick={() => this.props.onClick(y, x)}
                  />);
      }
      board.push(<div key={y}/>);
    }

    return (
      <div className="board" style={{width: this.props.boardWidth, height: this.props.boardHeight, display: display}}>
        <Scrollbars className="scrollArea">
          <div className="boardInner" style={{width: this.props.fieldsWidth, height: this.props.fieldsHeight}}>
            <div className="fields">
              {board}
            </div>
          </div>
        </Scrollbars>
      </div>
    );
  }
  /*
  componentDidUpdate() {
    ReactDOM.findDOMNode(this).scrollTop = this.props.boardScrollTop;
    ReactDOM.findDOMNode(this).scrollLeft = this.props.boardScrollLeft;
  }
  */
}

export default Board;
