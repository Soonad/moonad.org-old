import { Component } from "inferno";
import { h } from "inferno-hyperscript";
import { LayoutConstants } from "../../assets/Constants";

export interface Props {
  icon: string;
  title: string,
  onClick: () => any;
}

class ToolsButton extends Component<Props> {

  public hover = false;

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const style_btn = this.hover ? button_hover_style : button_style;

    return h("div", {
      style: style_btn, 
      onClick: this.props.onClick,
      onMouseEnter: () => { this.hover = true; this.forceUpdate(); },
      onMouseLeave: () => { this.hover = false; this.forceUpdate(); }
    }, [
        // h("img", {
        //   src: this.props.icon,
        //   style: {
        //     "margin-top": "4px",
        //     "width": "24px",
        //     "height": "24px",
        //   }
        // }),
        h("p", {
          style: {
            "color": LayoutConstants.dark_gray_color,
            "font-size": "12px",
            "font-family": "monospace",
            "margin": "0px"
          }
        }, this.props.title)
      ]
    );
  } 
}

const button_style = {
  "width": "100px",
  "height": "30px",
  "padding": "3px",
  "flex-direction": "column",
  "display": "flex",
  "align-items": "center",
  "justify-content": "center",
  "text-align": "center",
  "cursor": "pointer",
  "background-color": "#FFFFFF"
}

const button_hover_style = {
  ...button_style,
  // "background-color": "#000000"
  "font-weight": "bold"
}

export default ToolsButton;
