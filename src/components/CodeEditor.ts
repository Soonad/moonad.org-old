// Edits Formality Code

import {h} from "inferno-hyperscript"

const Editor = ({code, on_input_code}) => {
  return h("textarea", {
    oninput: (e) => on_input_code(e.target.value),
    value: code,
    style: {
      "margin-left": "10%",
      "margin-right": "10%",
      "border": "none",
      "outline": "none",
      "font-family": "monospace",
      "font-size": "14px",
      "padding": "8px",
      "width": "100%",
      "height": "100%",
      "spellcheck": "false",
      "data-gramm": "false"
    },
  }, [])
};

export default Editor
