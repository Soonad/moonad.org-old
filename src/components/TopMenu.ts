import {h} from "inferno-hyperscript"

const TopMenu = ({mode, file, load_file, on_click_view, on_click_edit, on_click_play}) => {
  return h("div", {
    "style": {
      "background": "rgb(240,240,240)",
      "height": "26px",
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
    h("span", {
      "onClick": () => {
        var file = prompt("File name:");
        if (file) load_file(file);
      },
      "style": {
        "cursor": "pointer",
        "flex-grow": "1"
      }
    }, file),
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
