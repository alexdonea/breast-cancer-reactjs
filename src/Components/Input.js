import React from "react";

const e = React.createElement;

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.value) {
      return {
        value: props.value
      };
    }
    return null;
  }

  render() {
    return e("input", {
      style: { margin: 4.5 },
      onChange: event => this.props.updateValue(event.target.value),
      placeholder: this.props.placeholder,
      value: this.state.value
    });
  }
}
export default Input;
