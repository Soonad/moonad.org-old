const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("formality-lang");
const CodeBrowser = require("./CodeBrowser.js");

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defs: null,
      writing: false,
    };
  }

  render() {

    return h("div",
      {style:
        { "font-family": "Gotham Book"
        , "height": "100%"}}, [
      h(CodeBrowser, {file: "Root@0"})
    ]);

    // Complete site
    return h("div",
      {style:
        { "font-family": "Gotham Book"
        , "height": "100%"}}, [

      // Top menu
      h("div", {style:
        { "background": "rgb(255,255,255)"
        , "border-bottom": "1px solid rgb(160,160,160)"
        //, "box-shadow": "inset 0px -6px 2px -5px rgba(69,57,91,1)"
        , "display": "flex"
        , "flex-flow": "row nowrap"
        , "align-items": "center"
        , "height": "44px"
        }}, [
          h("img", {
            style:
              { "width": "42px"
              , "cursor": "pointer"
              , "margin-left": "2px"
              },
            src: "assets/fm-logo.png"}),
          h("span", {
            onClick: () => {
            },
            style:
              { "padding-top": "6px"
              , "cursor": "pointer"
              , "font-size": "20px"
              , "font-weight": "bold"
              , "font-family": "Gotham Book"
              }},
            "Formality")
        ]),

      // Site body
      h("div", {style: {
        "display": "flex",
        "flex-flow": "row nowrap",
        "align-items": "flex-start",
        "height": "calc(100% - 44px)"
        }}, [

          // Left area
          //h("div", {style:
            //{ "width": "220px"
            //, "height": "100%"}},
            //"."),

          // Main area
          h("div", {style: {
            "width": "calc(100% - 16px)",
            "max-height": // TODO: improve. 100% fails. https://stackoverflow.com/questions/14262938/child-with-max-height-100-overflows-parent
              this.state.writing
              ? "calc((100vh - 44px) * 0.5 - 16px)"
              : "calc(100vh - 44px - 16px)",
            "margin": "8px",
            "background": "rgba(255,255,255,1)",
            "border-radius": "6px",
            "box-shadow": "0px 0px 6px 0px rgba(0,0,0,0.5)"
          }}, h(CodeBrowser, {file: "Welcome@0"})),

          // Right area
          //h("div", {style:
            //{ "width": "220px"
            //, "height": "100%"
          //}}, ".")
        ])
    ]);
  }
}

window.onload = () => {
  if (window.localStorage.getItem("fm_version") !== fm.lang.version) {
    window.localStorage.clear();
    window.localStorage.setItem("fm_version", fm.lang.version);
  }
  var file = window.location.pathname.slice(1);
  render(h(Main, {file}), document.getElementById("main"));
};
