const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("formality-lang");

class Write extends Component {
  constructor(props) {
    super(props)
    this.init(props)
  }

  componentWillReceiveProps(props) {
    this.init(props)
  }

  init(props) {
    this.writing = props.writing;
    this.toggle_writing = props.toggle_writing;
    this.set_file = props.set_file;
    this.state = {
      file: "MyPost",
      code: "import Welcome@0 // Import your citations below\n\n// Enter your code and comments here"
    }
    this.forceUpdate();
  }

  async post() {
    try {
      var global_file = await fm.lang.save_file(this.state.file, this.state.code);
      this.set_file(global_file);
    } catch (e) {
      alert(e.toString());
    }
  }

  render() {
    var writer = h("div", {
      "style":
        { "position": "absolute"
        , "visibility": this.writing ? null : "hidden"
        , "bottom": "0"
        , "left": "0px"
        , "width": "100%"
        , "height": "calc((100vh - 44px) * 0.5)"
        , "border-top": "1px solid gray"
        , "background": "rgb(200,200,200)"}},
      [
        h("div", {
          "style":
            { "height": "34px"
            , "width": "100%"
            , "display": "flex"
            , "flex-flow": "row nowrap"
            , "border-bottom": "1px solid gray"
            }
          }, [
            h("input", {
              "oninput": e => {
                this.setState({file: e.target.value.replace(new RegExp(" ", "g"), "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "")});
              },
              "value": this.state.file,
              "style":
                { "border": "0px solid black"
                , "border-bottom": "2px solid black"
                , "margin-left": "6px"
                , "width": "200px"
                , "background": "rgba(255,255,255,0.0)"
                , "outline": "none"
                , "font-size": "20px"
                , "padding": "8px"
                , "font-family": "monospace"
              }}, []),
            h("Span", {
              "style": 
                { "height": "34px"
                , "display": "flex"
                , "justify-content": "center"
                , "align-items": "center"
                , "font-weight": "bold"
                , "font-size": "20px"
                , "font-family": "monospace"
              }}, "@x.fm"),
          ]),
        h("div", {
          "style":
            { "height": "calc(100% - 34px)"
            , "width": "100%"
            , "background": "rgb(220,220,220)"
            }
          }, [
          h("textarea", {
            "value": this.state.code,
            "oninput": e => {
              this.setState({code: e.target.value});
            },
            "style":
              { "width": "calc(100% - 12px)"
              , "height": "calc(100% - 12px)"
              , "padding": "6px"
              , "margin": "6px"
              , "font-size": "14px"
              , "font-family": "monospace"
              , "outline": "none"
            }})])
      ]);

    var toggler = h("div", {
      "onClick": () => {
        this.toggle_writing();
      },
      "style":
        { "position": "absolute"
        , "bottom": "0px"
        , "width": "68px"
        , "height": "34px"
        , "right": "0px"
        , "border": "1px solid gray"
        , "cursor": "pointer"
        //, "text-decoration": "underline"
        , "display": "flex"
        , "align-items": "center"
        , "justify-content": "center"
        , "user-select": "none"
        , "font-family": "monospace"
        , "font-size": "16px"
        , "background-color": "rgb(200,200,200)"}},
      [this.writing ? "Hide" : "Write"]);

    var poster = h("div", {
      "onClick": () => {
        this.post();
      },
      "style":
        { "position": "absolute"
        , "top": "calc(44px + (100vh - 44px) * 0.5)"
        , "visibility": this.writing ? null : "hidden"
        , "height": "34px"
        , "width": "68px"
        , "right": "0px"
        , "border": "1px solid gray"
        , "cursor": "pointer"
        , "display": "flex"
        , "align-items": "center"
        , "justify-content": "center"
        , "user-select": "none"
        , "font-family": "monospace"
        , "font-size": "16px"
        //, "text-decoration": "underline"
        }},
      ["Post"]);

    return h("div", {}, [writer, toggler, poster]);
  }
}

module.exports = Write;
