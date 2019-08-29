// A simple browser for Formality Code

const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("formality-lang");

class Code extends Component {

  constructor(props) {
    super(props);

    this.file = null;   // String           -- name of the loaded file
    this.code = null;   // String           -- the loaded code
    this.defs = null;   // {[String]: Term} -- the defs inside that code
    this.tokens = null; // [[String, Info]] -- chunks of code with syntax highlight info

    if (props.code) this.load_code(props.code);
    if (props.file) this.load_file(props.file);
  }

  // Loads a file (ex: "Data.Bool@0")
  async load_file(file) {
    await this.load_code(await fm.lang.load_file(file));
    this.file = file;
  }

  // Loads a code
  async load_code(code) {
    this.file = null;
    this.code = code;
    var {defs, tokens} = await fm.lang.parse("test_file", this.code, true);
    this.defs = defs;
    this.tokens = tokens;
    this.forceUpdate();
  }

  // Loads file/code from propps
  componentWillReceiveProps(props) {
    if (props.code) this.load_code(props.code);
    if (props.file) this.load_file(props.file);
  }

  // Type-checks a definition 
  typecheck(name) {
    try {
      var type = fm.lang.show(fm.lang.norm(this.defs[name], this.defs, "TYPE", {}));
      var good = true;
    } catch (e) {
      var type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
      var good = false;
    }
    var text = "";
    if (good) {
      text += "✓ " + name + " : " + type + "\n\nTerm checked successfully!";
    } else {
      text += "✗ " + name + "\n\n" + type;
    }
    alert(text);
  }

  // Normalizes a definition
  normalize(name) {
    try {
      var norm = fm.lang.show(fm.lang.norm(this.defs[name], this.defs, "DEBUG", {}));
    } catch (e) {
      var norm = "<unable_to_normalize>";
    };
    alert(norm);
  }

  async componentDidMount() {
  }

  // Event when user clicks a definition 
  onClickDef(path) {
    return e => {
      if (!e.shiftKey) {
        return this.typecheck(path);
      } else {
        return this.normalize(path);
      }
    }
  }

  // Event when user clicks a reference
  onClickRef(path) {
    return e => {
      console.log("...", path);
      this.load_file(path.slice(0, path.indexOf("/")));
    }
  }

  // Renders the interface
  render() {
    if (!this.tokens) {
      return h("div", {}, "Loading code...");
    }

    var code_chunks = [];
    for (var i = 0; i < this.tokens.length; ++i) {
      var attrs = (() => {
        switch (this.tokens[i][0]) {
          case "txt" : return {style: {"color": "black"}};
          case "sym" : return {style: {"color": "#15568f"}};
          case "cmm" : return {style: {"color": "#A2A8D3"}};
          case "num" : return {style: {"color": "green"}};
          case "var" : return {style: {"color": "black"}};
          case "ref" : return {style: {"color": "#38598B", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}, onClick: this.onClickRef(this.tokens[i][2])};
          case "def" : return {style: {"color": "#4384e6", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}, onClick: this.onClickDef(this.tokens[i][2])}; 
          default    : return {};
        }
      })();
      code_chunks.push(h("span", attrs, (this.tokens[i][1])));
    }

    return h("code", {}, h("pre", {}, code_chunks));
  }

}

module.exports = Code;
