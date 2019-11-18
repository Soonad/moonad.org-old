import { h } from "inferno-hyperscript"
import { LayoutConstants } from "../assets/Constants";
import Pathbar from "./Pathbar";

// Assets
// import logo from "../assets/moonad_logo.png";

type Mode = "EDIT" | "PLAY" | "VIEW";
type LoadFile = (module_or_term: string, push_history?: boolean) => any;

export interface Props {
  mode: Mode;
  file: string;
  load_file: LoadFile;
  on_click_view: () => any;
  on_click_edit: () => any;
  on_click_play: () => any;
}

const TopMenu = ({mode, file, load_file, on_click_view, on_click_edit, on_click_play}: Props) => {
  return h("div", {
    style: {
      "background": LayoutConstants.primary_color,
      "height": "65px",
      "font-family": "monospace",
      "font-size": "16px",
      "display": "flex",
      "user-select": "none",
      "flex-flow": "row nowrap",
      "justify-content": "flex-begin",
      "align-items": "center",
      "border-bottom": "1px solid rgb(180,180,180)"
    }
  }, [
    h("img", {
      style: {
        "width": "50px",
        "height": "40px",
        "margin-top": "13px",
        "margin-left": "10%",
        "cursor": "pointer"
      }, 
      src: new URL('https://images.pexels.com/photos/57416/cat-sweet-kitty-animals-57416.jpeg?cs=srgb&dl=animal-animal-photography-cat-57416.jpg&fm=jpg'), 
      alt: "logo", 
      onClick: () => { load_file("Base@0") } }), 
    h(Pathbar, {load_file}),
    h("span", {
      "onClick": () => on_click_view(),
      "style": {
        "padding-right": "8px",
        "cursor": "pointer",
        "font-weight": mode === "VIEW" ? "bold" : null
      }
    }, " [view] "),
    h("span", {
      "onClick": () => on_click_edit(),
      "style": {
        "padding-right": "8px",
        "cursor": "pointer",
        "font-weight": mode === "EDIT" ? "bold" : null
      }
    }, " [edit] "),
    h("span", {
      "onClick": () => on_click_play(),
      "style": {
        "padding-right": "8px",
        "cursor": "pointer",
        "font-weight": mode === "PLAY" ? "bold" : null
      }
    }, " [play] ")
  ]);
};

export default TopMenu
