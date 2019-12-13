// The bottom console of the site, with cited_by, output, tools, etc.
import { Component } from "inferno";
import { h } from "inferno-hyperscript";

import { CitedByParent, ConsoleTabs, DisplayMode, ExecCommand, LayoutConstants, LoadFile, LocalFile, LocalFileManager } from "../../assets/Constants";

// Components
import CitedBy from "./CitedBy";
import ConsoleTopBar from "./ConsoleTopBar";
import ConsoleView from "./ConsoleView";

interface TabElement {tab: ConsoleTabs, view: TabViewType}
type TabViewType = "cited_by" | "terminal" | "tools";

export interface Props {
  load_file: LoadFile;
  cited_by: CitedByParent;
  mode: DisplayMode;
  exec_command: ExecCommand;
  local_file_manager: LocalFileManager;
}

// The div which displays the Bottom element of the screen
class Console extends Component<Props> {
  
  public view_on_focus: TabViewType = "cited_by";

  constructor(props: Props) {
    super(props);
  }

  public render() {
    const tabs: ConsoleTabs[] = [
      {
        is_on_focus: this.view_on_focus === "cited_by" && this.props.mode !== "EDIT",
        title: "Cited By",
        onClick: () => { this.view_on_focus = "cited_by"; this.forceUpdate();}
      },
      {
        is_on_focus: this.view_on_focus === "terminal" && this.props.mode !== "EDIT",
        title: "Console",
        onClick: () => { this.view_on_focus = "terminal"; this.forceUpdate(); }
      },
      {
        is_on_focus: this.view_on_focus === "tools" || this.props.mode === "EDIT",
        title: "Tools",
        onClick: () => { this.view_on_focus = "tools"; this.forceUpdate(); }
      }
    ];

    return h("div", {
      style: {
        "height": "130px",
        "min-height": "130px",
        "width": "100%",
        "background-color": LayoutConstants.light_gray_color,
        "overflow": "scroll",
      }
    }, [
      h(ConsoleTopBar, { tabs, mode: this.props.mode }),
      ConsoleView({view_on_focus: this.view_on_focus, 
        mode: this.props.mode, 
        load_file: this.props.load_file,
        parents: this.props.cited_by,
        exec_command: this.props.exec_command,
        local_file_manager: this.props.local_file_manager
      })
    ])
  }
}

export default Console;
