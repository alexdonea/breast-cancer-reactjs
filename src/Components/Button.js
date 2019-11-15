import React from "react";

const e = React.createElement;
const buttonStyle = {
  outline: "none",
  margin: 7.5
};

class Button extends React.Component {
  render() {
    return e(
      "button",
      {
        onClick: this.props.onClick,
        style: buttonStyle
      },
      this.props.label
    );
  }
}

export default Button;
