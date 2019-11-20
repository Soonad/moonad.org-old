
import { h } from "inferno-hyperscript";
import { Component } from "inferno";
import { LayoutConstants, Mode, LoadFile, CitedByParent } from "../../assets/Constants";
import CitedBy from "./CitedBy";

interface Props {
  view_on_focus: string;
  mode: Mode;
  load_file: LoadFile;
  parents: Array<string>;
}

const ConsoleView = ({view_on_focus, mode, load_file, parents}: Props) => {
  switch(mode) {
    case "EDIT": 
      return h("div", {style});
    case "VIEW":

      switch(view_on_focus) {
        case "cited_by": 
          return h("div", {style}, cited_by_view(parents, load_file) );
        case "console":
          return h("div", {style}, "View for console");
      }

    case "PLAY": 
      return h("div", {style});
  }
}

const style = {
  "margin-left": "10%",
  "margin-right": "10%",
  "margin-top": "25px",
  "padding-bottom": "15px",
  "font-family": "monospace",
  "font-size": "13px",
  "padding-top": "10px"
}

// Auxiliary functions
const result_aux = h("span", {style: {"color": LayoutConstants.secondary_color}}, "► ");
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
const cited_by_view = (parents: Array<string>, load_file) => {
  const qtd = parents.length || 0;
  const cited_by_msg = format_console_msg(qtd > 1? qtd + " results" : qtd + " result");
  const cited_by = h(CitedBy, {parents, load_file});
  
  return h("div", {}, [
      result_aux, cited_by_msg,
      cited_by
    ]);
}



export default ConsoleView;