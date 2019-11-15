const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;

const defaultPath = "Base@0";

class PathBar extends Component {
  constructor(props) {
    super(props);

    // State
    this.editing = false;
    this.path = "";

  }

  onClick() {
    this.editing = true;
    this.path = "";
  }

  onInput(e) {
    if (this.editing) {
      this.editing = true;
      console.log(">> Path bar, e value: "+e);
      // this.path = e
    }
  }

  onKeyPress(e) {
    console.log(">> [Path baar] onKeyPress: "+e);
    if (e.keyCode === 13 && state.editing) {
      this.editing = false;
      // TODO: check is the path is correct
      this.props.load_file(this.path);
    }
  }

  render(){
    if (this.editing) {
      return h("input", {
        type: "text",
        style: input_style,
        value: state.path,
        ref: input_ref,
        placeholder: "Search ...",
        onBlur,
        onKeyPress,
        onInput,
      });
    }
    return h("div", { style, onClick }, path);
  }
}

const style = { 
  heigth: "20px", 
  width: "50%", 
  color: "#FFFFFF",
  marginLeft: "30px",
  marginTop: "35px",
  fontSize: "16px",
};

const input_style = {
  ...style,
  border: "none",
  marginTop: "23px",
  marginBottom: "5px",
  // borderBottom: `1px solid ${LayoutConstants.light_gray_shadow_color}`,
  outline: "none",
  fontFamily: "monospace",
  fontColor: LayoutConstants.light_gray_color,
  backgroundColor: LayoutConstants.primary_shadow_color
};