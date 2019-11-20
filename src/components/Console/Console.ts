// The bottom console of the site, with cited_by, output, tools, etc.
import { Component } from "inferno";
import { h } from "inferno-hyperscript";

import { LayoutConstants, ConsoleTabs, LoadFile, CitedByParent, Mode } from "../../assets/Constants";

// Components
import CitedBy from "./CitedBy";
import ConsoleTopBar from "./ConsoleTopBar";
import ConsoleView from "./ConsoleView";

interface TabElement {tab: ConsoleTabs, view: TabViewType}
type TabViewType = "cited_by" | "console";

export interface Props {
  load_file: LoadFile;
  cited_by: CitedByParent;
  mode: Mode;
}

// The div which displays the Bottom elmeent of the screen
class Console extends Component<Props> {
  
  view_on_focus: TabViewType = "cited_by";

  constructor(props: Props) {
    super(props);
  } 

  render() {
    const tabs: Array<ConsoleTabs> = [
      {
        is_on_focus: this.view_on_focus === "cited_by",
        title: "Cited By",
        onClick: () => { this.view_on_focus = "cited_by"; this.forceUpdate();}
      },
      {
        is_on_focus: this.view_on_focus === "console",
        title: "Console",
        onClick: () => { this.view_on_focus = "console"; this.forceUpdate(); }
      },
      {
        is_on_focus: this.view_on_focus === "console",
        title: "Console",
        onClick: () => { this.view_on_focus = "console"; this.forceUpdate(); }
      }
    ];

    return h("div", {
      style: {
        "height": "180px",
        "min-height": "120px",
        "width": "100%",
        "background-color": LayoutConstants.light_gray_color,
        "overflow": "scroll",
      }
    }, [
      h(ConsoleTopBar, { tabs }),
      ConsoleView({view_on_focus: this.view_on_focus, 
        mode: this.props.mode, 
        load_file: this.props.load_file,
        parents: this.props.cited_by}),
    ]);
  }
};

export default Console
