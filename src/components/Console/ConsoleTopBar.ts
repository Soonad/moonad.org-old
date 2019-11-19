
import { h } from "inferno-hyperscript";
import { Component } from "inferno";
import { LayoutConstants } from "../../assets/Constants";

interface Props {
  tabs: [ConsoleTabs];
  tab_on_focus: TabViewType;
}

type TabViewType = "cited_by" | "console";

const ConsoleTopBar = ({tabs, tab_on_focus}: Props) => {
  return h("div", {
    style: {
      "height": "25px",
      "width": "100%",
      "border-top": `1px solid ${LayoutConstants.light_gray_shadow_color}`,
      "background-color": "#FFFFFF",
    }
  }, [
    h("div", {
      desc: "Console tabs div",
      style: {
        "margin-left": "10%",
        "margin-right": "10%",
        "width": "60%",
        "height": "100%",
        "display": "flex",
        "flex-direction": "row"
      }
    }, [
      tabs.map( 
        (tab: ConsoleTabs) => h(ConsoleTab, {
          is_on_focus: tab_on_focus === tab.title,
          title: tab.title,
          onClick: tab.onClick
        }) 
      )
    ])
  ]);
}

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
      onMouseEnter: () => { this.hover = true },
      onMouseLeave: () => { this.hover = false }
    },
    this.props.title)
  }
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
// ----
// Tabs
// ----
const console_tab_style = {
  "align-self": "center",
  "text-align": "baseline",
  "cursor": "pointer",
  "padding-right": "20px",
  "padding-left": "20px",
  "padding-top": "5px",
  "min-height": "30px",
  "user-select": "none",
}

const console_tab_style_focus = {
  ...console_tab_style,
  "border-bottom": "2px solid "+ LayoutConstants.secondary_color
}

const console_tab_style_hover = {
  ...console_tab_style,
  "background-color": LayoutConstants.light_gray_shadow_color,
  "height": "100%",
}

export default ConsoleTopBar;