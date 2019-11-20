// Renders Formality code with syntax highlighting

import {h} from "inferno-hyperscript"
import CountLines from "./CountLines";

//document.addEventListener("touchmove", function (evt) {
  //evt.preventDefault();
//}, false);

const CodeRender = ({code, tokens, on_click_def, on_click_imp, on_click_ref}) => {
  if (!tokens) {
    return h("div", {
      style: {
        "padding": "8px",
        "flex-grow": 1
      }
    }, "Loading code from FPM. This may take a while...");
  }

  // Makes spans for each code chunk
  var code_chunks = [];
  for (let i = 0; i < tokens.length; ++i) {
    let child = tokens[i][1];
    let elem = (() => {
      switch (tokens[i][0]) {
        case "txt":
          return h("span", {style: {"color": "black"}}, child);
        case "sym":
          return h("span", {style: {"color": "#15568f"}}, child);
        case "cmm":
          return h("span", {style: {"color": "#A2A8D3"}}, child);
        case "num":
          return h("span", {style: {"color": "green"}}, child);
        case "var":
          return h("span", {style: {"color": "black"}}, child);
        case "imp":
          var [file, hash] = child.split("#");
          return h("a", {
            href: window.location.origin + "/" + tokens[i][1],
            style: {
              "color": "black",
              "text-decoration": "underline",
              "cursor": "pointer"
            },
            on_click: e => {
              on_click_imp(tokens[i][1])(e);
              e.preventDefault();
            }}, [
              h("span", {style: {"font-weight": "bold"}}, file),
              h("span", {style: {"color": "#B0B0B0"}}, "#" + hash)
            ]);
        case "ref":
          return h("a", {
            href: window.location.origin
              + "/" + tokens[i][2].replace(new RegExp("/.*$"), ""),
            style: {
              "color": "#38598B",
              "text-decoration": "underline",
              "font-weight": "bold",
              "cursor": "pointer"
            },
            on_click: e => {
              on_click_ref(tokens[i][2])(e);
              e.preventDefault();
            }}, child);
        case "def":
          return h("span", {
            style: {
              "color": "#4384e6",
              "text-decoration": "underline",
              "font-weight": "bold",
              "cursor": "pointer"
            },
            on_click: e => {
              on_click_def(tokens[i][2])(e);
            }
          }, child);
        default:
          return h("span", {}, child);
      }
    })();
    code_chunks.push(elem);
  }

  // TODO: comment and explain
  var max_cols = 80;
  var max_font_size = 14;
  var padding = 4;
  var width = Math.min(max_font_size * (3/5) * max_cols, window.innerWidth);
  var font_size = Math.floor(((width - padding * 2) / max_cols) * (5/3));

  return h("code", {
    role: "CodeRender div",
    style: {
      //"width": width + "px",
      "width": "100%",
      "font-size": font_size + "px",
      "padding": padding + "px",
      "max-width": "100%",
      "overflow-y": "scroll",
      "overflow-x": "hidden",
      "flex-grow": 1
    }
  }, [
    // CountLines(4),
    h("pre", {}, [code_chunks])
  ]);
};

export default CodeRender
