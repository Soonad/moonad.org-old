import { Component } from "inferno";
import { h } from "inferno-hyperscript"
import { LayoutConstants } from "../assets/Constants";

export interface Props {
  icon: string;
  title: string;
  onClick: () => any;
  is_on_focus: boolean;
}

class TopMenuButton extends Component<Props> {

  public hover = false;

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const style_btn = this.hover ? button_hover_style : button_style;
    const style_title = this.props.is_on_focus ? font_focus_style : font_style;
    
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
          style: style_title
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
  "font-weight": "bold"
}

const font_style = {
  "color": "#FFFFFF",
  "font-size": "12px",
  "font-family": "monospace",
  "margin": "0px"
}
const font_focus_style = {
  ...font_style,
  "font-weight": "bold"
}



export default TopMenuButton;
