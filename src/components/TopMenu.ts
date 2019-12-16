import { h } from "inferno-hyperscript"
import { DisplayMode, LayoutConstants, LoadFile } from "../assets/Constants";
import Pathbar from "./Pathbar";
import TopMenuButton from "./TopMenuButton";

// Assets
const logo = "../assets/moonad_white_symbol.png";
const icon_edit = "../assets/icons/icon_edit.png";
const icon_console = "../assets/icons/icon_console.png";
const icon_play = "../assets/icons/icon_play.png";

export interface Props {
  mode: DisplayMode;
  file: string;
  load_file: LoadFile;
  on_click_view: () => any;
  on_click_edit: () => any;
  on_click_play: () => any;
}

const TopMenu = ({mode, file, load_file, on_click_view, on_click_edit, on_click_play}: Props) => {
  const menu_height = 48;

  return h("div", {
    style: {
      "background": "url(assets/topbar-bg-3.png)",
      "background-size": "cover",
      "min-height": menu_height + "px",
      "font-family": "monospace",
      "font-size": "16px",
      "display": "flex",
      "user-select": "none",
      "width": "100%",
      "flex-flow": "row nowrap",
      "justify-content": "flex-start"
    }
  }, [
    h("div", {
      style: {
        "width": "60px",
        "height": menu_height + "x",
        "cursor": "pointer",
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
      }}, [
      h("img", {
        style: {
          "width": "45px",
          "height": "35px",
        }, 
        src: logo,
        alt: "logo", 
        onClick: () => { load_file("Base#") }
      })
    ]),
    h("div", {
      style: {
        "height": menu_height + "px",
        "display": "flex",
        "align-items": "flex-end",
        "flex-grow": 1,
      }
    }, 
      h("div", {style: {
        "flex-direction": "column",
      }}, [
        is_editing_mode(mode),
        h(Pathbar, {load_file, path: file})
      ])
    ),
    h("div", {desc: "Buttons div", 
      style: {
        // "width": "230px",
        "height": menu_height + "px", 
        "display": "flex",
        "flex-direction": "row",
        "justify-content": "space-between",
        "user-select": "none"
      }}, [
        h(TopMenuButton, {icon: icon_edit,
          title: "EDIT",
          onClick: () => on_click_edit(),
          is_on_focus: mode === "EDIT" ? true : false
        }), 
        h(TopMenuButton, {icon: icon_console,
          title: "INSPECT",
          onClick: () => on_click_view(),
          is_on_focus: mode === "VIEW" ? true : false
        }), 
        h(TopMenuButton, {icon: icon_play,
          title: "PLAY",
          onClick: () => on_click_play(),
          is_on_focus: mode === "PLAY" ? true : false
        }), 
      ]
    )
  ]);
};

const is_editing_mode = (mode: string) => {
  if(mode === "EDIT"){
    return h("span", {style: {
      "padding-left": "8px",
      "font-size": "12px",
      "color": "#FFFFFF"
    }}, "Editing");
  }
}

export default TopMenu
