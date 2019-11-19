// The bottom console of the site, with cited_by, output, tools, etc.

import { h } from "inferno-hyperscript";
import CitedBy from "./Console/CitedBy";
import { LayoutConstants, ConsoleTabs, LoadFile, CitedByParent } from "../assets/Constants";
import ConsoleTopBar from "./Console/ConsoleTopBar";
import { Component } from "inferno";

interface TabElement {tab: ConsoleTabs, view: TabViewType}
type TabViewType = "cited_by" | "console";

export interface Props {
  load_file: LoadFile;
  cited_by: CitedByParent;
}

class Console extends Component<Props> {
  
  view_on_focus: TabViewType = "cited_by";

  constructor(props: Props) {
    super(props);
    console.log("Console!! Parents: "+this.props.cited_by);
  } 

  // Builds the cited_by links
  // var links = [];
  // if (cited_by) {
  //   for (var i = 0; i < cited_by.length; ++i) {
  //     let parent_file = cited_by[i];
  //     links.push(h("div", {
  //       "onClick": e => {
  //         load_file(parent_file);
  //       },
  //       "style": {
  //         "cursor": "pointer",
  //         "text-decoration": "underline"
  //       }
  //     }, parent_file));
  //   }
  // }
  // console.log(">> Console, links: "+links);

  render() {
    const tabs = [
      {
        tab: {
          is_on_focus: this.view_on_focus === "cited_by",
          title: "Cited By",
          onClick: () => { this.view_on_focus = "cited_by"}
        },
        view: "cited_by",
      },
      {
        tab: {
          is_on_focus: this.view_on_focus === "console",
          title: "Check all",
          onClick: () => { this.view_on_focus = "console" }
        },
        view: "console"
      }
    ];

    return h("div", {
      style: {
        "height": "180px",
        "width": "100%",
        "background-color": LayoutConstants.light_gray_color,
        "overflow-bottom": "scroll"
      }
    }, [
      h(ConsoleTopBar, {
        tabs: tabs.map( ({tab, view} : TabElement) => tab ),
        view_on_focus: this.view_on_focus
      }),

      // h("div", {
      //   "style": {
      //     "font-weight": "bold"
      //   }
      // }, "Cited by:"),
      // links
    ]);
  }

  
};

export default Console
