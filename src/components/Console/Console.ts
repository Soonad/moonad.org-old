// The bottom console of the site, with cited_by, output, tools, etc.
import { Component } from "inferno";
import { h } from "inferno-hyperscript";

import { CitedByParent, ConsoleTabs, DisplayMode, ExecCommand, LayoutConstants, LoadFile } from "../../assets/Constants";

// Components
import CitedBy from "./CitedBy";
import ConsoleTopBar from "./ConsoleTopBar";
import ConsoleView from "./ConsoleView";

interface TabElement {tab: ConsoleTabs, view: TabViewType}
type TabViewType = "cited_by" | "terminal";

export interface Props {
  load_file: LoadFile;
  cited_by: CitedByParent;
  mode: DisplayMode;
  exec_command: ExecCommand;
  // exec_command: (cmd: string) => any;
}

// The div which displays the Bottom elmeent of the screen
class Console extends Component<Props> {
  
  public view_on_focus: TabViewType = "cited_by";

  constructor(props: Props) {
    super(props);
  } 

  public render() {
    const tabs: ConsoleTabs[] = [
      {
        is_on_focus: this.view_on_focus === "cited_by",
        title: "Cited By",
        onClick: () => { this.view_on_focus = "cited_by"; this.forceUpdate();}
      },
      {
        is_on_focus: this.view_on_focus === "terminal",
        title: "Console",
        onClick: () => { this.view_on_focus = "terminal"; this.forceUpdate(); }
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
        parents: this.props.cited_by,
        exec_command: this.props.exec_command}),
    ])
  }
}

export default Console
