import { Component, render } from "inferno";
import { h } from "inferno-hyperscript";
import CodeBrowser from "./CodeBrowser";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defs: null,
      writing: false
    };
  }

  render() {
    return h(
      "div",
      { style: { "font-family": "Gotham Book", "height": "100%" } },
      [h(CodeBrowser, { file: "Root@0" })]
    );
  }
}

window.onload = () => {
  render(h(Main, {}), document.getElementById("main"));
};
