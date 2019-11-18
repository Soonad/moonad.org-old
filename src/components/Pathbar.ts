import { Component, render } from "inferno";
import { h } from "inferno-hyperscript";
import { LayoutConstants } from "../assets/Constants";

const default_path = "Base@0";

type LoadFile = (module_or_term: string, push_history?: boolean) => any;

export interface Props {
  load_file: LoadFile;
}

class Pathbar extends Component<Props> {
  
  // State
  editing = false;
  file_name = default_path;

  constructor(props: Props) {
    super(props);
  }

  onClick() {
    this.editing = true;
    this.file_name = "";
    this.forceUpdate();
  }

  onInput(e) {
    const evt = e as InputEvent;
    if (this.editing && evt.target) {
      const ele = evt.target as HTMLInputElement;
      this.editing = true;
      this.file_name = ele.value;
    }
    this.forceUpdate();
  }

  onKeyDown(e) {
    const onLoadCode = (file, push) => this.props.load_file(file, push);

    if (e.keyCode === 13 && this.editing) {
      this.editing = false;
      const is_valid = this.verify_format(this.file_name);
      // TODO: if not valid, tell the user
      if (is_valid) {
        this.props.load_file(this.file_name);
      }
    }
    this.forceUpdate();
  }

  verify_format(file_name: string): boolean {
    const module_regex = /^[a-zA-Z_\.-@]+@\d+$/;
    return module_regex.test(file_name);
  }

  render() {
    const onClick = () => this.onClick();
    const onKeyDown = (e) => this.onKeyDown(e);
    const onInput = (e) => this.onInput(e);

    if (this.editing) {
      return h("input", {
        type: "text",
        style: input_style,
        value: this.file_name,
        placeholder: "Search...",
        onKeyDown,
        onInput
      });
    }
    return h("div", { style, onClick }, this.file_name);
  }
}

const style = { 
  "heigth": "20px",
  "width": "350px",
  "color": "#FFFFFF",
  "margin-left": "30px",
  "margin-top": "35px",
  "font-size": "16px",
};

const input_style = {
  ...style,
  "border": "none",
  "margin-top": "23px",
  "margin-bottom": "5px",
  "padding": "3px",
  "outline": "none",
  "font-family": "monospace",
  "font-color": LayoutConstants.light_gray_color,
  "background-color": LayoutConstants.primary_shadow_color
};

export default Pathbar