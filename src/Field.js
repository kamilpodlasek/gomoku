import React, { Component } from 'react';

class Field extends Component {
  render() {
    const noHighlight = { backgroundColor: "none" };
    const highlight = { filter: "saturate(10)" };
    let value = this.props.value === null ? "" : this.props.value;
    let img = require("./" + (this.props.bgNum + 1) + value + ".png");

    return (
      <div className={"field " + this.props.value}
      	   style={Object.assign(this.props.highlight ? highlight : noHighlight, {width: this.props.fieldSize, height: this.props.fieldSize, fontSize: this.props.fieldSize, backgroundImage: "url(" + img + ")"})}
      	   onClick={() => this.props.onClick()}></div>
    );
  }
}

export default Field;
