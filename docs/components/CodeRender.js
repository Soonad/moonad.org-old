// Renders Formality code with syntax highlighting

const h = require("inferno-hyperscript").h;

const CodeRender = ({code, tokens, on_click_def, on_click_imp, on_click_ref}) => {
  if (code === "<error>") {
    return h("div", {"style": {"padding": "8px"}}, "Failed to load code.");
  }

  if (!tokens) {
    return h("div", {"style": {"padding": "8px"}}, "Loading code from FPM. This may take a while...");
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
          return h("a", {
            href: window.location.origin + "/" + tokens[i][1],
            style: {
              "color": "black",
              "text-decoration": "underline",
              "font-weight": "bold",
              "cursor": "pointer"
            },
            on_click: e => {
              on_click_imp(tokens[i][1])(e);
              e.preventDefault();
            }}, child);
        case "ref":
          return h("a", {
            href: window.location.origin + "/" + tokens[i][2].replace(new RegExp("/.*$"), ""),
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

  return h("code", {
    "style": {
      "padding": "8px",
      "overflow": "scroll",
      "flex-grow": 1
    }
  }, [
    h("pre", {}, [code_chunks])
  ]);
};

module.exports = CodeRender;
