const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("formality-lang");
const CodeBrowser = require("./CodeBrowser.js");
const Write = require("./Write.js");

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defs: null,
      writing: false,
      file: ""
    };
    this.set_file(props.file || "Welcome@0");
  }

  set_file(file, push_state = true) {
    if (push_state) {
      window.history.pushState(file, null, file);
    }
    this.state.file = file;
    this.forceUpdate();
  }

  render() {

    // Complete site
    return h("div",
      {style:
        { "font-family": "Gotham Book"
        , "height": "100%"}}, [

      // Top menu
      h("div", {style:
        { "background": "rgb(255,255,255)"
        , "border-bottom": "1px solid rgb(20,16,26)"
        //, "box-shadow": "inset 0px -6px 2px -5px rgba(69,57,91,1)"
        , "display": "flex"
        , "flex-flow": "row nowrap"
        , "align-items": "center"
        , "height": "44px"
        }}, [
          h("img", {
            onClick: () => {
              this.set_file("Welcome@0");
            },
            style:
              { "width": "42px"
              , "cursor": "pointer"
              , "margin-left": "2px"
              },
            src: "assets/fm-logo.png"}),
          h("span", {
            onClick: () => {
              this.set_file("Welcome@0");
            },
            style:
              { "padding-top": "6px"
                , "cursor": "pointer"
              , "font-size": "16px"
              , "font-weight": "bold"
              , "font-family": "Gotham Book"
              }},
            "Provit/"),
          h("span", {
            onClick: () => {
              var file = prompt("File to load:");
              if (file) this.set_file(file);
            },
            style:
              { "padding-top": "6px"
              , "font-size": "16px"
              , "font-family": "Gotham Book"
              , "text-decoration": "underline"
              , "cursor": "pointer"
              }},
            this.state.file),
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
          }}, h(CodeBrowser,
            { file: this.state.file
            , set_file: (file, push_state) => this.set_file(file, push_state)
            })),

          // Right area
          //h("div", {style:
            //{ "width": "220px"
            //, "height": "100%"
          //}}, ".")
        ]),

      // Writer
      h(Write,
        { writing: this.state.writing
        , file: this.state.file
        , set_file: (file, push_state) => this.set_file(file, push_state)
        , toggle_writing: () => this.setState({writing: !this.state.writing})
        })
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
