const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("formality-lang");
const CodeBrowser = require("./CodeBrowser.js");

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {defs: null};
    this.elems = [];
  }

  render() {
    return h("div", {style: {"font-family": "Gotham Book"}}, [
      h("div", {style: {
        "background": "white",
        "margin-bottom": "24px",
        "border-bottom": "1px solid gray",
        "display": "flex",
        "flex-flow": "row nowrap",
        "align-items": "center",
        "height": "44px"
        }}, [
          h("img", {style: {"width": "42px"}, src: "assets/fm-logo.png"}),
          h("span", {style: {
            "padding-top": "6px",
            "font-family": "Gotham Book"}},
            "Provit!")
        ]),
      h("div", {style: {
        "display": "flex",
        "flex-flow": "column nowrap",
        "align-items": "center",
        }}, [
          h("div", {style: {
            "background": "white",
            "padding": "8px",
            "border-radius": "6px",
            "box-shadow": "0px 0px 6px 0px rgba(0,0,0,0.5)"
          }}, h(CodeBrowser, {file: "SimpleProofExample@0"}))])
    ]);
  }
}

window.onload = () => {
  render(h(Main), document.getElementById("main"));
};
