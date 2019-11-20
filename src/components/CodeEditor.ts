// Edits Formality Code

import {h} from "inferno-hyperscript"

const Editor = ({code, on_input_code}) => {

  // TODO: comment and explain
  // TODO: prevent this duplicated code (copied from CodeRender.ts)
  var max_cols = 80;
  var max_font_size = 14;
  var padding = 4;
  var width = Math.min(max_font_size * (3/5) * max_cols, window.innerWidth);
  var font_size = Math.floor(((width - padding * 2) / max_cols) * (5/3));

  return h("textarea", {
    oninput: (e) => on_input_code(e.target.value),
    value: code,
    style: {
      "outline": "none",
      "font-family": "monospace",
      "font-size": font_size + "px",
      "border": "0px solid black",
      "padding": padding + "px",
      "width": "800px",
      "height": "100%",
      "spellcheck": "false",
      "data-gramm": "false"
    },
  }, [])
};

export default Editor
