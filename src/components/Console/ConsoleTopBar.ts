
import { h } from "inferno-hyperscript";
import { Component } from "inferno";
import { LayoutConstants } from "../../assets/Constants";

interface Props {
  tabs: [ConsoleTabs];
}

type TabViewType = "cited_by" | "console";

const ConsoleTopBar = ({tabs}: Props) => {
  return h("div", {
    desc: "Console TopBar div",
    style: {
      "min-height": "25px",
      "height": "25px",
      "width": "100%",
      "border-top": `1px solid ${LayoutConstants.medium_gray_color}`,
      "border-bottom": `1px solid ${LayoutConstants.medium_gray_color}`,
      "background-color": "#FFFFFF",
      "position": "absolute"
    }
  }, [
    h("div", {
      desc: "Console tabs div",
      style: {
        "padding-left": "20px",
        "padding-right": "20px",
        "width": "60%",
        "height": "100%",
        "display": "flex",
        "flex-direction": "row",
        "aling-text": "center"
      }
    }, [
      tabs.map( 
        (tab: ConsoleTabs) => h(ConsoleTab, {
          is_on_focus: tab.is_on_focus,
          title: tab.title,
          onClick: tab.onClick
        }) 
      )
    ])
  ]);
}

// -----
// Tabs
// -----
export interface ConsoleTabs {
  is_on_focus: boolean;
  title: string;
  onClick: () => void;
}

class ConsoleTab extends Component<ConsoleTabs> {

  hover = false 

  constructor(props: ConsoleTabs){
    super(props);
  }

  render() {
    const style_btn = this.hover ? console_tab_style_hover : console_tab_style;
    return h("div", {
      onClick: this.props.onClick,
      style: this.props.is_on_focus ? console_tab_style_focus : style_btn,
      onMouseEnter: () => { this.hover = true; this.forceUpdate() },
      onMouseLeave: () => { this.hover = false; this.forceUpdate() }
    },
    this.props.title)
  }
}

const console_tab_style = {
  "align-self": "center",
  "text-align": "baseline",
  "cursor": "pointer",
  "padding-right": "20px",
  "padding-left": "20px",
  "padding-top": "5px",
  "min-height": "25px",
  "min-width": "110px",
  "text-aling": "center",
  "user-select": "none",
  "aling-self": "baseline",
  "font-family": "monospace",
  "font-size": "14px",
  "color": LayoutConstants.dark_gray_color
}

const console_tab_style_focus = {
  ...console_tab_style,
  "border-bottom": "2px solid "+ LayoutConstants.secondary_color
}

const console_tab_style_hover = {
  ...console_tab_style,
  "background-color": LayoutConstants.light_gray_shadow_color,
  "padding-top": "4px",
  "border-bottom": "1px solid "+ LayoutConstants.medium_gray_color,
  "border-top": "1px solid "+ LayoutConstants.medium_gray_color,
}

// -------------
// Close Button
// -------------
export interface CloseButton {
  onClick: () => any
}
// TODO: add image src
const CloseButton = ({ onClick }: CloseButton) => {
  return h("div", {onClick, 
    style: {
      "width": "15px", 
      "height": "15px",
      "align-self": "center",
      "cursor": "pointer",
      "margin-right": "10%"
    }}, [
    h("img", {src: "", style: {width: "15px", height: "15px"}})
  ])
}

export default ConsoleTopBar;
