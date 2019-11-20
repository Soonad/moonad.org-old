import { h } from "inferno-hyperscript"
import { LayoutConstants } from "../assets/Constants";
import { Component } from "inferno";

export interface Props {
  icon: string;
  title: string,
  onClick: () => any;
}

class TopMenuButton extends Component<Props> {

  hover = false;

  constructor(props: Props) {
    super(props);
  }

  render() {
    const style_btn = this.hover ? button_hover_style : button_style;

    return h("div", {
      style: style_btn, 
      onClick: this.props.onClick,
      onMouseEnter: () => { this.hover = true; this.forceUpdate(); },
      onMouseLeave: () => { this.hover = false; this.forceUpdate(); }
    }, [
        h("img", {
          src: this.props.icon,
          style: {
            "margin-top": "4px",
            "width": "24px",
            "height": "24px",
          }
        }),
        h("p", {
          style: {
            "color": "#FFFFFF",
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
  "width": "60px",
  "height": "100%",
  "flex-direction": "column",
  "display": "flex",
  "align-items": "center",
  "justify-content": "center",
  "text-align": "center",
  "cursor": "pointer"
}

const button_hover_style = {
  ...button_style,
  "background-color": LayoutConstants.primary_shadow_color
}

export default TopMenuButton;
