const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("./../../Formality-JavaScript/FM-Core");

const code = `
// ::::::::::
// :: Bool ::
// ::::::::::

// Bool datatype. Desugars to:
// def Bool       : Type = $ self {~P : {b : Bool} -> Type, T : (P Bool.true), F : (P Bool.false)} -> (P self)
// def Bool.true  : Bool = @ Bool {~P, T, F} => T
// def Bool.false : Bool = @ Bool {~P, T, F} => F
T Bool
| true
| false 

// Simple not
Bool.not : {|b : Bool} -> Bool
| true  = Bool.false
| false = Bool.true

// ::::::::::
// :: List ::
// ::::::::::

T List <A : Type>
| push  {head : A, tail : List(A)}
| empty

// The dependent pattern match syntax is still not able to deal with indices,
// so we must use the case syntax
head : {~T : Type, default : T, list : List(T)} -> T
  case<List> list
  | push  => head
  | empty => default
  : T

tail : {~T : Type, list : List(T)} -> List(T)
  case<List> list
  | push  => tail
  | empty => List.empty(~T)
  : List(T)
`;

const tokens = fm.lang.parse(code, true).tokens;

const elems = [];
for (var i = 0; i < tokens.length; ++i) {
  var attrs = (function(){
    switch (tokens[i][0]) {
      case "txt" : return {style: {color: "black"}};
      case "sym" : return {style: {color: "blue"}};
      case "cmm" : return {style: {color: "gray"}};
      case "num" : return {style: {color: "green"}};
      case "var" : return {style: {color: "orange"}};
      case "ref" : return {style: {color: "purple", "text-decoration": "underline", cursor: "pointer"}};
      case "def" : return {style: {color: "red", "font-weight": "bold", cursor: "pointer"}}; 
      default    : return {};
    }
  })();
  elems.push(h("span", attrs, tokens[i][1]));
}

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {clicks: 0};
  }
  componentDidMount() {
  }
  render() {
    return h("div", {style: {"font-family": "Gotham Book"}}, [
      h("div", {style: {
        "background": "rgb(87,89,107)",
        "margin-bottom": "24px",
        "display": "flex",
        "flex-flow": "row nowrap",
        "align-items": "center",
        "box-shadow": "inset 0px -32px 32px -32px rgba(0,0,0,0.5)",
        "height": "64px"
        }}, [
          h("img", {style: {"width": "42px"}, src: "fm-logo.png"})
        ]),
      h("div", {style: {
        "display": "flex",
        "flex-flow": "column nowrap",
        "align-items": "center",
        }}, [
          h("code", 
            {style: {
              "background": "white",
              "width": "800px",
              "overflow": "scroll",
              "padding": "8px",
              "border-radius": "6px",
              "box-shadow": "0px 0px 6px 0px rgba(0,0,0,0.5)"
            }},
            h("pre", {}, elems))
        ])
        //"Hello, world! Clicks! " + this.state.clicks)
    ]);
  }
}

window.onload = () => {
  render(h(Main), document.getElementById("main"));
};
