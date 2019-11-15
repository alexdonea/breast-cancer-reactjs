import React from "react";

const e = React.createElement;

const consoleStyle = {
  width: "100%",
  height: 510,
  resize: "none",
  outline: "none",
  fontSize:15
};

class Console extends React.Component {
  constructor(props) {
    super(props);
    this.textLog = React.createRef();
    this.state = {
      console: this.props.console
    };
  }
  componentDidUpdate(){
    this.textLog.current.scrollTop = this.textLog.current.scrollHeight;
  }
  static getDerivedStateFromProps(props, state) {
    if (props.console !== state.console) {
      return {
        console: props.console.join("\n")
      };
    }
    return null;
  }

  render() {
    return e("textarea", {
      ref:this.textLog, 
      style: consoleStyle,
      defaultValue: this.state.console
    });
  }
}

export default Console;
