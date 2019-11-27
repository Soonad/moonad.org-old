// Edits Formality Code

import { EventHandler } from "inferno";
import { h } from "inferno-hyperscript"


interface Props {
  code: string,
  on_input_code: (e: string) => void
}

const Editor = ({code, on_input_code}: Props) => {

  // TODO: comment and explain
  // TODO: prevent this duplicated code (copied from CodeRender.ts)
  const max_cols = 80;
  const max_font_size = 14;
  const padding = 4;
  const width = Math.min(max_font_size * (3/5) * max_cols, window.innerWidth);
  const font_size = Math.floor(((width - padding * 2) / max_cols) * (5/3));

  return h("textarea", {
    oninput: (e: any) => on_input_code(e.target.value),
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
