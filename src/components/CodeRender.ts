// Renders Formality code with syntax highlighting

import {h} from "inferno-hyperscript"
import { Tokens } from "../../docs/assets/Constants";
import CountLines from "./CountLines";

// document.addEventListener("touchmove", function (evt) {
  // evt.preventDefault();
// }, false);
interface Props {
  code: string;
  tokens: any; 
  on_click_def: any;
  on_click_imp: any;
  on_click_ref: any;
}

const CodeRender = ({code, tokens, on_click_def, on_click_imp, on_click_ref}: Props) => {
  if (!tokens) {
    return h("div", {
      style: {
        "padding": "8px",
        "flex-grow": 1,
        "font-family": "monospace",
        "font-size": "14px"
      }
    }, "Loading code from FPM. This may take a while...");
  }

  // Makes spans for each code chunk
  const code_chunks = [];
  // tslint:disable-next-line
  for (let i = 0; i < tokens.length; ++i) {
    const child = tokens[i][1];
    const elem = (() => {
      switch (tokens[i][0]) {
        case "txt":
          return h("span", {desc: "txt", style: {"color": "black"}}, child);
        case "sym":
          return h("span", {desc: "sym", style: {"color": "#15568f"}}, child);
        case "cmm":
          return h("span", {desc: "cmm", style: {"color": "#A2A8D3"}}, child);
        case "num":
          return h("span", {desc: "num", style: {"color": "green"}}, child);
        case "var":
          return h("span", {desc: "var", style: {"color": "black"}}, child);
        case "imp":
          const [file, hash] = child.split("#");
          return h("a", {
            desc: "imp",
            href: window.location.origin + "/" + tokens[i][1],
            style: {
              "color": "black",
              "text-decoration": "underline",
              "cursor": "pointer"
            },
            on_click: (e: any) => {
              on_click_imp(tokens[i][1])(e);
              e.preventDefault();
            }}, [
              h("span", {desc: "a-file", style: {"font-weight": "bold"}}, file),
              h("span", {desc: "a-hash", style: {"color": "#B0B0B0"}}, "#" + hash)
            ]);
        case "ref":
          return h("a", {
            desc: "ref",
            href: window.location.origin
              + "/" + tokens[i][2].replace(new RegExp("/.*$"), ""),
            style: {
              "color": "#38598B",
              "text-decoration": "underline",
              "font-weight": "bold",
              "cursor": "pointer"
            },
            on_click: (e: any) => {
              on_click_ref(tokens[i][2])(e);
              e.preventDefault();
            }}, child);
        case "def":
          return h("span", {
            desc: "def",
            style: {
              "color": "#4384e6",
              "text-decoration": "underline",
              "font-weight": "bold",
              "cursor": "pointer"
            },
            on_click: (e: any) => {
              on_click_def(tokens[i][2])(e);
            }
          }, child);
        default:
          return h("span", {desc: "default"}, child);
      }
    })();
    code_chunks.push(elem);
  }

  // TODO: comment and explain
  const max_cols = 80;
  const max_font_size = 14;
  const padding = 4;
  const width = Math.min(max_font_size * (3/5) * max_cols, window.innerWidth);
  const font_size = Math.floor(((width - padding * 2) / max_cols) * (5/3));

  return h("code", {
    role: "CodeRender div",
    style: {
      // "width": width + "px",
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
