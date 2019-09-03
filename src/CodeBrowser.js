// A simple browser for Formality Code

const {Component, render} = require("inferno");
const h = require("inferno-hyperscript").h;
const fm = require("formality-lang");

class Code extends Component {

  constructor(props) {
    super(props);

    this.file = null;    // String           -- name of the loaded file
    this.code = null;    // String           -- the loaded code
    this.defs = null;    // {[String]: Term} -- the defs inside that code
    this.parents = null; // [String]         -- FPM files that imported the loaded file
    this.tokens = null;  // [[String, Info]] -- chunks of code with syntax highlight info

    this.set_file = props.set_file;

    if (props.code) this.load_code(props.code);
    if (props.file) this.load_file(props.file);
  }

  componentDidMount() {
    window.onpopstate = e => {
      if (e && e.state) {
        this.set_file(e.state, false);
      }
    };
  }

  // Loads file/code from propps
  componentWillReceiveProps(props) {
    if (props.code) this.load_code(props.code);
    if (props.file) this.load_file(props.file);
  }


  // Loads a file (ex: "Data.Bool@0")
  async load_file(file) {
    //console.log("... load", file);
    if (file.slice(-3) === ".fm") {
      file = file.slice(0, -3);
    }
    if (file.indexOf("@") === -1) {
      file = file + "@0";
    }
    //console.log("... load", file);
    try {
      this.parents = [];
      await this.load_code(await fm.lang.load_file(file));
      this.parents = await fm.lang.load_file_parents(file);
    } catch (e) {
      this.code = "<error>";
    }
    //console.log("done");
    this.file = file;
    this.forceUpdate();
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

  // Type-checks a definition 
  typecheck(name) {
    try {
      var type = fm.lang.show(fm.lang.norm(this.defs[name], this.defs, "TYPE", {}));
      var good = true;
    } catch (e) {
      var type = e.toString().replace(/\[[0-9]m/g, "").replace(/\[[0-9][0-9]m/g, "");
      var good = false;
    }
    var text = ":: Type ::\n";
    if (good) {
      text += "✓ " +  type;
    } else {
      text += "✗ " + type;
    }
    try {
      var norm = fm.lang.norm(this.defs[name], this.defs, "DEBUG", {erased: true, unbox: true, logging: true});
      text += "\n\n:: Output ::\n";
      text += fm.lang.show(norm, [], {full_refs: false});
    } catch (e) {};
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
      this.set_file(path.slice(0, path.indexOf("/")));
    }
  }

  // Event when user clicks an import
  onClickImp(file) {
    return e => {
      this.set_file(file);
    }
  }

  // Renders the interface
  render() {
    if (this.code === "<error>") {
      return h("div", {"style": {"padding": "8px"}}, "Failed to load code.");
    }

    if (!this.tokens) {
      return h("div", {"style": {"padding": "8px"}}, "Loading code from FPM. This may take a while...");
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
          case "imp" : return {style: {"color": "black", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}, onClick: this.onClickImp(this.tokens[i][1])}; // Ex: ["imp", "Data.Bool@0"]
          case "ref" : return {style: {"color": "#38598B", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}, onClick: this.onClickRef(this.tokens[i][2])}; // Ex: ["ref", "true", "Data.Bool@0/true"]
          case "def" : return {style: {"color": "#4384e6", "text-decoration": "underline", "font-weight": "bold", "cursor": "pointer"}, onClick: this.onClickDef(this.tokens[i][2])};  // Ex: ["def", "true", "Data.Bool@0/true"]
          default    : return {};
        }
      })();
      code_chunks.push(h("span", attrs, (this.tokens[i][1])));
    }

    var parents = [];
    if (this.parents) {
      for (var i = 0; i < this.parents.length; ++i) {
        let parent_file = this.parents[i];
        parents.push(h("div", {
          "onClick": e => {
            this.set_file(parent_file);
          },
          "style":
            { "cursor": "pointer"
            , "text-decoration": "underline"
            }
          },
          parent_file));
      }
    }

    return h("div", {
      style:
        { "font-family": "monospace"
        , "font-size": "14px" 
        , "display": "flex"
        , "flex-flow": "row nowrap"}
      }, [
        h("code", {"style": {"padding": "8px", "flex-grow": 1}}, [h("pre", {}, [code_chunks])]),
          h("div", {"style": {"padding": "8px", "border-left": "1px dashed gray", "background-color": "rgb(240,240,240)", "overflow-bottom": "scroll"}}, [
            h("div", {"style": {"font-weight": "bold"}}, "Cited by:"),
            parents
          ])
      ]);
  }

}

module.exports = Code;
