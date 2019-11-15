const h = require("inferno-hyperscript").h;

const TopMenu = ({editing, file, load_file, on_click_edit, on_click_save}) => {
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
      "onClick": () => on_click_edit(),
      "style": {
        "padding-right": "8px",
        "cursor": "pointer"
      }
    }, editing ? "✓" : "✎"),
    h("span", {
      "onClick": () => on_click_save(),
      "style": {
        "padding-right": "8px",
        "cursor": "pointer",
        "user-select": "none",
        "opacity": file === "local" && !editing ? "1.0" : "0.4"}
      }, "💾")
  ]);
};

module.exports = TopMenu;
