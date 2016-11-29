import React, { Component } from 'react';

class Field extends Component {
  render() {
    const highlight = { backgroundColor: "#b3b3b3" };
    const noHighlight = { backgroundColor: "#e0e0e0" };

    return (
      <div className={"field " + this.props.value} style={Object.assign(this.props.highlight ? highlight : noHighlight, {width: this.props.fieldSize, height: this.props.fieldSize, fontSize: this.props.fieldSize})} onClick={() => this.props.onClick()}></div>
    );
  }
}

export default Field;
