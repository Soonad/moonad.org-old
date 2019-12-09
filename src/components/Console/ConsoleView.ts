
import { Component } from "inferno";
import { h } from "inferno-hyperscript";
import { CitedByParent, DisplayMode, ExecCommand, LayoutConstants, LoadFile, LocalFile, LocalFileManager } from "../../assets/Constants";
import CitedBy from "./CitedBy";
import Terminal from "./Terminal";
import { Tools} from "./Tools";

type TabViewType = "cited_by" | "terminal" | "tools";

interface Props {
  view_on_focus: TabViewType;
  mode: DisplayMode;
  load_file: LoadFile;
  parents: string[];
  // res_cmd: Array<string>;
  exec_command: ExecCommand;
  local_file_manager: LocalFileManager;
}

// TODO: 
// > cited by is not receiving data from FPM
const ConsoleView = ({view_on_focus, mode, load_file, parents, exec_command, local_file_manager}: Props) => {
  switch(mode) {
    case "EDIT": // can save file 
      return h("div", {style}, Tools(local_file_manager));
    case "VIEW":

      switch(view_on_focus) {
        case "cited_by": 
          return h("div", {style}, cited_by_view(parents, load_file) );
        case "terminal":
          return h(Terminal, {res_cmd: [], exec_command});
        case "tools":
          return h("div", {style}, Tools(local_file_manager));
      }

    case "PLAY": 
      return h("div", {style});
  }
}

const style = {
  "margin-top": "25px",
  "margin-left": "20px",
  "margin-right": "20px",
  "padding-bottom": "15px",
  "font-family": "monospace",
  "font-size": "10px",
  "padding-top": "05px"
}

// Auxiliary functions
const result_aux = h("span", {style: {"color": LayoutConstants.secondary_color, "font-size": "8px",}}, "► ");
const format_console_msg = (msg: string) => {
  return  h("span", {
    style: {
      "color": LayoutConstants.dark_gray_color, 
      "font-weight": "bold",
      "font-family": "monospace",
    }
  }, msg);
}
// -----
// Views
// -----
const cited_by_view = (parents: string[], load_file: LoadFile) => {
  const qtd = parents.length || 0;
  const cited_by_msg = format_console_msg(qtd > 1? qtd + " results" : qtd + " result");
  const cited_by = h(CitedBy, {parents, load_file});
  console.log("[consolve view] Cited by: ", cited_by);
  return h("div", {}, [
      result_aux, cited_by_msg,
      cited_by
    ]);
}



export default ConsoleView;
