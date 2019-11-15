import React from "react";

const e = React.createElement;

const labelStyle = {
    padding:4,
    cursor:'pointer'
}

const radioStyle = {
    marginRight:6
}
class RadioButton extends React.Component {
  
    render() {
        return e('label',{
            style:labelStyle
        },
        e("input", {
            style:radioStyle,
            type: "radio",
            value: this.props.value,
            name:'training-mode',
            // checked: this.props.value === 'default' ? true : false,
            onClick:()=>this.props.onModeSelection(this.props.value)
        },null),
        e("span", {}, this.props.label)
        );  
    }
}

export default RadioButton;
