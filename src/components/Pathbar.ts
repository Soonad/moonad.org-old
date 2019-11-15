import { Component, render } from "inferno";
import { h } from "inferno-hyperscript";
import { LayoutConstants } from "../assets/Constants";

const defaultPath = "Base@0";


type LoadFile = (module_or_term: string, push_history: boolean) => any;

export interface Props {
  path: string;
  load_code: LoadFile;
}

class PathBar extends Component<Props> {
  
  // State
  editing = false;
  internal_path = "";

  constructor(props: Props) {
    super(props);

    // State
    // this.editing = false;
    // this.path = "";

  }

  onClick() {
    this.editing = true;
    this.props.path = "";
  }

  onInput(e) {
    if (this.editing) {
      this.editing = true;
      console.log(">> Path bar, e value: "+e);
      // this.internal_path = e
    }
  }

  onKeyPress(e) {
    console.log(">> [Path baar] onKeyPress: "+e);
    if (e.keyCode === 13 && this.editing) {
      this.editing = false;
      // TODO: check is the path is correct
      this.props.load_code(this.internal_path, true);
    }
  }

  render(){
    if (this.editing) {
      return h("input", {
        type: "text",
        style: input_style,
        value: this.internal_path,
        placeholder: "Search ...",
        onKeyPress: this.onKeyPress,
        onInput: this.onInput,
      });
    }
    return h("div", { style, onClick: this.onClick }, this.props.path);
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

export default PathBar